using Documentviewer.Models;
using Documentviewer.Services.Interfaces;
using UglyToad.PdfPig;

namespace Documentviewer.Services
{
    public class DocumentsService : IDocumentsService
    {
        private readonly string _documentFolder;
        public DocumentsService(IWebHostEnvironment env)
        {
            _documentFolder = Path.Combine(env.WebRootPath, "Documents");
        }

        public List<DocumentModel> GetAllDocuments()
        {
            if (!Directory.Exists(_documentFolder))
                Directory.CreateDirectory(_documentFolder);

            var files = Directory.GetFiles(_documentFolder);

            return files.Select(f => new DocumentModel
            {
                FileName = Path.GetFileName(f),
                FilePath = Path.GetRelativePath(_documentFolder, f),
                UploadedOn = File.GetCreationTime(f)
            }).ToList();
        }
        public List<DocumentModel> SearchDocuments(string searchTerm)
        {
            var results = new List<DocumentModel>();
            var allDocs = GetAllDocuments();

            foreach (var doc in allDocs)
            {
                string fullPath = Path.Combine(_documentFolder, doc.FilePath);
                string content = ExtractText(fullPath);

                if (!string.IsNullOrEmpty(content) &&
                    content.IndexOf(searchTerm, StringComparison.OrdinalIgnoreCase) >= 0)
                {
                    results.Add(doc);
                }
            }

            return results;
        }
        private string ExtractText(string filePath)
        {
            string ext = Path.GetExtension(filePath).ToLower();

            if (ext == ".pdf")
            {
                using var pdf = PdfDocument.Open(filePath);
                return string.Join(" ", pdf.GetPages().Select(p => p.Text));
            }
            else if (ext == ".txt")
            {
                return File.ReadAllText(filePath);
            }

            return string.Empty;
        }
    }
}
