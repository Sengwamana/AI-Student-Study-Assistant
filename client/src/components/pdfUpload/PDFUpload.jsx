import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf.mjs";

// Configure PDF.js worker from public folder (legacy build for compatibility)
GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const PDFUpload = ({
  onTextExtracted,
  onError,
  onClear,
  disabled = false,
}) => {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState(null);
  const [extractedPreview, setExtractedPreview] = useState("");
  const [metadata, setMetadata] = useState(null);
  const [showFullText, setShowFullText] = useState(false);
  const [fullText, setFullText] = useState("");

  // Extract text from PDF
  const extractTextFromPDF = async (pdfFile) => {
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await getDocument({ data: arrayBuffer }).promise;
      
      const totalPages = pdf.numPages;
      setProgress({ current: 0, total: totalPages });
      
      let fullText = "";
      
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        setProgress({ current: pageNum, total: totalPages });
        
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item) => item.str)
          .join(" ");
        
        fullText += pageText + "\n\n";
      }
      
      return {
        text: fullText.trim(),
        pageCount: totalPages,
      };
    } catch (err) {
      console.error("PDF extraction error:", err);
      throw new Error("Could not extract text from PDF. Please try another file or paste notes manually.");
    }
  };

  // Validate file
  const validateFile = (file) => {
    if (!file) {
      return "No file selected";
    }
    
    if (file.type !== "application/pdf") {
      return "Please upload a PDF file only";
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds 10MB limit (${formatFileSize(file.size)})`;
    }
    
    return null;
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Count words
  const countWords = (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  // Handle file upload
  const handlePDFUpload = async (acceptedFile) => {
    setError(null);
    setExtractedPreview("");
    setMetadata(null);
    setFullText("");
    
    const validationError = validateFile(acceptedFile);
    if (validationError) {
      setError(validationError);
      onError?.(validationError);
      return;
    }
    
    setFile(acceptedFile);
    setIsProcessing(true);
    
    try {
      const result = await extractTextFromPDF(acceptedFile);
      
      if (!result.text || result.text.trim().length === 0) {
        throw new Error("No text found in PDF. This might be a scanned document.");
      }
      
      const wordCount = countWords(result.text);
      
      setFullText(result.text);
      setExtractedPreview(result.text.substring(0, 500));
      setMetadata({
        fileName: acceptedFile.name,
        fileSize: formatFileSize(acceptedFile.size),
        pageCount: result.pageCount,
        wordCount: wordCount,
        charCount: result.text.length,
      });
      
      onTextExtracted?.(result.text, {
        fileName: acceptedFile.name,
        fileSize: acceptedFile.size,
        pageCount: result.pageCount,
        wordCount: wordCount,
      });
      
    } catch (err) {
      const errorMessage = err.message || "Unable to read PDF file. Please check the file and try again.";
      setError(errorMessage);
      onError?.(errorMessage);
      setFile(null);
    } finally {
      setIsProcessing(false);
      setProgress({ current: 0, total: 0 });
    }
  };

  // Handle file drop
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles && rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === "file-invalid-type") {
        setError("Please upload a PDF file only");
      } else if (rejection.errors[0]?.code === "file-too-large") {
        setError("File size exceeds 10MB limit");
      } else {
        setError("Invalid file. Please try again.");
      }
      return;
    }
    
    if (acceptedFiles && acceptedFiles.length > 0) {
      handlePDFUpload(acceptedFiles[0]);
    }
  }, []);

  // Clear uploaded file
  const handleClear = () => {
    setFile(null);
    setError(null);
    setExtractedPreview("");
    setMetadata(null);
    setFullText("");
    setShowFullText(false);
    onClear?.();
  };

  // Dropzone configuration
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    disabled: disabled || isProcessing,
  });

  // Determine visual state class
  const getDropzoneClass = () => {
    let className = "border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 bg-surface hover:border-indigo-400/40 hover:bg-indigo-50/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/10 group";
    
    if (isDragActive && !isDragReject) {
      className += " border-indigo-500 bg-indigo-50/50 scale-[1.02] shadow-xl shadow-indigo-500/15";
    }
    
    if (isDragReject) {
      className += " border-red-500 bg-red-50/50 animate-shake";
    }
    
    if (error) {
      className += " border-red-500";
    }
    
    if (file && !isProcessing && !error) {
      className += " border-emerald-500/50 bg-emerald-50/5 dark:bg-emerald-900/5";
    }
    
    if (isProcessing) {
      className += " cursor-not-allowed opacity-60";
    }
    
    if (disabled) {
      className += " cursor-not-allowed opacity-60 bg-gray-50 dark:bg-gray-900/50";
    }
    
    return className;
  };

  return (
    <div className="w-full animate-fade-in-up">
      {!file && !isProcessing && (
        <div {...getRootProps()} className={getDropzoneClass()}>
          <input {...getInputProps()} aria-label="Upload PDF study notes" />
          <div className="flex flex-col items-center gap-3">
            <div className="text-4xl leading-none transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110">📄</div>
            {isDragActive ? (
              <p className="text-[15px] font-semibold text-text-primary m-0">Drop your PDF here...</p>
            ) : (
              <>
                <p className="text-[15px] font-semibold text-text-primary m-0">
                  Drag & drop PDF here or click to browse
                </p>
                <p className="text-[13px] text-text-muted m-0">Maximum file size: 10MB</p>
              </>
            )}
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="flex flex-col items-center gap-4 p-8 bg-surface border-2 border-indigo-500/30 rounded-2xl animate-fade-in">
          <div className="w-9 h-9 border-[3px] border-gray-200 dark:border-gray-700 border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="text-sm text-text-secondary font-medium animate-pulse m-0">
            {progress.total > 0
              ? `Extracting page ${progress.current} of ${progress.total}...`
              : "Extracting text from PDF..."}
          </p>
          <div className="w-full max-w-[280px] h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500 bg-[length:200%_100%] rounded-full transition-all duration-300 animate-shimmer"
              style={{
                width: progress.total > 0
                  ? `${(progress.current / progress.total) * 100}%`
                  : "0%",
              }}
            ></div>
          </div>
        </div>
      )}

      {error && !isProcessing && (
        <div className="flex flex-col items-center gap-3 p-6 bg-red-50/50 dark:bg-red-900/10 border-2 border-red-500/50 rounded-2xl animate-fade-in">
          <div className="text-3xl animate-shake">⚠️</div>
          <p className="text-sm text-red-600 dark:text-red-400 font-medium text-center m-0">{error}</p>
          <button
            type="button"
            className="py-2.5 px-6 bg-red-500 text-white border-0 rounded-xl text-[13px] font-semibold cursor-pointer transition-all hover:bg-red-600 hover:-translate-y-0.5 hover:shadow-md hover:shadow-red-500/20 active:translate-y-0 active:scale-95"
            onClick={() => {
              setError(null);
              setFile(null);
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {file && metadata && !isProcessing && !error && (
        <div className="bg-surface border-2 border-emerald-500/50 rounded-2xl p-4.5 flex flex-col gap-4 animate-scale-in transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 hover:border-emerald-500/70">
          <div className="flex items-center gap-3">
            <div className="text-3xl flex-shrink-0 animate-bounce-in">📑</div>
            <div className="flex-1 min-w-0 flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-text-primary truncate">{metadata.fileName}</span>
              <span className="text-xs text-text-muted">
                {metadata.fileSize} • {metadata.pageCount} page{metadata.pageCount !== 1 ? "s" : ""} • {metadata.wordCount.toLocaleString()} words
              </span>
            </div>
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 border border-transparent rounded-xl text-text-muted cursor-pointer transition-all hover:bg-red-500 hover:text-white hover:scale-105"
              onClick={handleClear}
              aria-label="Remove uploaded PDF"
            >
              ✕
            </button>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3.5 border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Extracted Text Preview:</span>
              <span className="text-xs text-text-muted">{metadata.charCount.toLocaleString()} characters</span>
            </div>
            <div className="text-[13px] text-text-secondary leading-relaxed max-h-[130px] overflow-y-auto whitespace-pre-wrap scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
              {showFullText ? fullText : extractedPreview}
              {!showFullText && fullText.length > 500 && "..."}
            </div>
            {fullText.length > 500 && (
              <button
                type="button"
                className="mt-2.5 py-1.5 px-3.5 bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-text-secondary cursor-pointer transition-all hover:bg-surface hover:border-indigo-500/30 hover:text-indigo-600"
                onClick={() => setShowFullText(!showFullText)}
              >
                {showFullText ? "Show less" : "Show full text"}
              </button>
            )}
          </div>
          
          <div className="text-[13px] text-emerald-600 dark:text-emerald-400 text-center py-2.5 px-3.5 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl font-medium border border-emerald-100 dark:border-emerald-900/20">
            ✅ PDF text extracted successfully! You can now ask questions about this content.
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFUpload;
