using Documentviewer.Models;

namespace Documentviewer.Services.Interfaces
{
    public interface IDocumentsService
    {
        List<DocumentModel> GetAllDocuments();
        List<DocumentModel> SearchDocuments(string searchTerm);
    }
}
