using System.Web.Mvc;
using Business = BusinessLayer;
using Entity = EntityLayer;

namespace AdminPresentationLayer.Controllers
{
    public class BranchOfficeController : Controller
    {
        // GET: BranchOffice
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult BranchOfficeRead()
        {
            var data = new Business.BranchOffice().Read();
            var json = new { data };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult BranchOfficeCreate(Entity.BranchOffice branchOffice)
        {
            var result = new Business.BranchOffice().Create(branchOffice, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult BranchOfficeUpdate(Entity.BranchOffice branchOffice)
        {
            var result = new Business.BranchOffice().Update(branchOffice, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult BranchOfficeDelete(Entity.BranchOffice branchOffice)
        {
            var result = new Business.BranchOffice().Delete(branchOffice, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }
    }
}