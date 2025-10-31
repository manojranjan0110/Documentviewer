using Documentviewer.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Documentviewer.Controllers
{
    public class DocumentController : Controller
    {
        private readonly IDocumentsService _searchService;
        public DocumentController(IDocumentsService searchService)
        {
            _searchService = searchService;
        }

        [HttpGet]
        public IActionResult Dashboard()
        {
            var documents = _searchService.GetAllDocuments();
            return View(documents);
        }

        [HttpGet]
        public JsonResult Search(string keyword)
        {
            var results = string.IsNullOrWhiteSpace(keyword)
                ? _searchService.GetAllDocuments()
                : _searchService.SearchDocuments(keyword);

            return Json(results);
        }
    }
}
