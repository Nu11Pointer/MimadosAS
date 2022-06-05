using System.Web.Mvc;
using Business = BusinessLayer;
using Entity = EntityLayer;

namespace AdminPresentationLayer.Controllers
{
    public class BranchOfficeController : Controller
    {
        // GET: BranchOffice
        #region BranchOffice
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult ReadBranchOffices()
        {
            var data = new Business.BranchOffice().Read();
            var json = new { data };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult ReadActiveBranchOffices()
        {
            var data = new Business.BranchOffice().ReadActive();
            var json = new { data };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult CreateBranchOffice(Entity.BranchOffice branchOffice)
        {
            var result = new Business.BranchOffice().Create(branchOffice, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult UpdateBranchOffice(Entity.BranchOffice branchOffice)
        {
            var result = new Business.BranchOffice().Update(branchOffice, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult DeleteBranchOffice(Entity.BranchOffice branchOffice)
        {
            var result = new Business.BranchOffice().Delete(branchOffice, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region BranchOfficePhone
        public ActionResult BranchOfficePhone()
        {
            return View();
        }

        [HttpGet]
        public JsonResult ReadBranchOfficePhones()
        {
            var data = new Business.BranchOfficePhone().Read();
            var json = new { data };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult ReadBranchOfficePhoneByBranchOfficeId(int branchOfficeId)
        {
            var data = new Business.BranchOfficePhone().ReadByBranchOffice(branchOfficeId);
            var json = new { data };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult CreateBranchOfficePhone(Entity.BranchOfficePhone branchOfficePhone)
        {
            var result = new Business.BranchOfficePhone().Create(branchOfficePhone, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult UpdateBranchOfficePhone(Entity.BranchOfficePhone branchOfficePhone)
        {
            var result = new Business.BranchOfficePhone().Update(branchOfficePhone, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult DeleteBranchOfficePhone(Entity.BranchOfficePhone branchOfficePhone)
        {
            var result = new Business.BranchOfficePhone().Delete(branchOfficePhone, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}