using System.Web.Mvc;
using Business = BusinessLayer;
using Entity = EntityLayer;

namespace AdminPresentationLayer.Controllers
{
    public class SupplierEmailController : Controller
    {
        // GET: SupplierEmail
        [HttpPost]
        public JsonResult Create(Entity.SupplierEmail supplierEmail)
        {
            var result = new Business.SupplierEmail().Create(supplierEmail, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Read()
        {
            var data = new Business.SupplierEmail().Read();
            var json = new { data };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult ReadByEmployeId(int employeeId)
        {
            var data = new Business.SupplierEmail().ReadBySupplierId(employeeId);
            var json = new { data };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Update(Entity.SupplierEmail supplierEmail)
        {
            var result = new Business.SupplierEmail().Update(supplierEmail, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Delete(Entity.SupplierEmail supplierEmail)
        {
            var result = new Business.SupplierEmail().Delete(supplierEmail, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }
    }
}