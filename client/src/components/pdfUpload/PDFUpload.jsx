import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf.mjs";
import "./pdfUpload.css";

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
    let className = "pdfDropzone";
    if (isDragActive && !isDragReject) className += " dragActive";
    if (isDragReject) className += " dragReject";
    if (error) className += " hasError";
    if (file && !isProcessing && !error) className += " hasFile";
    if (isProcessing) className += " processing";
    if (disabled) className += " disabled";
    return className;
  };

  return (
    <div className="pdfUpload">
      {!file && !isProcessing && (
        <div {...getRootProps()} className={getDropzoneClass()}>
          <input {...getInputProps()} aria-label="Upload PDF study notes" />
          <div className="dropzoneContent">
            <div className="uploadIcon">📄</div>
            {isDragActive ? (
              <p className="dropText">Drop your PDF here...</p>
            ) : (
              <>
                <p className="dropText">
                  Drag & drop PDF here or click to browse
                </p>
                <p className="dropHint">Maximum file size: 10MB</p>
              </>
            )}
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="processingState">
          <div className="spinner"></div>
          <p className="processingText">
            {progress.total > 0
              ? `Extracting page ${progress.current} of ${progress.total}...`
              : "Extracting text from PDF..."}
          </p>
          <div className="progressBar">
            <div
              className="progressFill"
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
        <div className="errorState">
          <div className="errorIcon">⚠️</div>
          <p className="errorText">{error}</p>
          <button
            type="button"
            className="retryButton"
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
        <div className="fileInfo">
          <div className="fileHeader">
            <div className="fileIcon">📑</div>
            <div className="fileDetails">
              <span className="fileName">{metadata.fileName}</span>
              <span className="fileMeta">
                {metadata.fileSize} • {metadata.pageCount} page{metadata.pageCount !== 1 ? "s" : ""} • {metadata.wordCount.toLocaleString()} words
              </span>
            </div>
            <button
              type="button"
              className="clearButton"
              onClick={handleClear}
              aria-label="Remove uploaded PDF"
            >
              ✕
            </button>
          </div>
          
          <div className="extractedPreview">
            <div className="previewHeader">
              <span className="previewLabel">Extracted Text Preview:</span>
              <span className="charCount">{metadata.charCount.toLocaleString()} characters</span>
            </div>
            <div className="previewText">
              {showFullText ? fullText : extractedPreview}
              {!showFullText && fullText.length > 500 && "..."}
            </div>
            {fullText.length > 500 && (
              <button
                type="button"
                className="toggleFullText"
                onClick={() => setShowFullText(!showFullText)}
              >
                {showFullText ? "Show less" : "Show full text"}
              </button>
            )}
          </div>
          
          <div className="successMessage">
            ✅ PDF text extracted successfully! You can now ask questions about this content.
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFUpload;
