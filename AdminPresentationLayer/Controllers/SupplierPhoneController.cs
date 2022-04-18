using System.Web.Mvc;
using Business = BusinessLayer;
using Entity = EntityLayer;

namespace AdminPresentationLayer.Controllers
{
    public class SupplierPhoneController : Controller
    {
        // GET: SupplierPhone
        [HttpPost]
        public JsonResult Create(Entity.SupplierPhone supplierPhone)
        {
            var result = new Business.SupplierPhone().Create(supplierPhone, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Read()
        {
            var data = new Business.SupplierPhone().Read();
            var json = new { data };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult ReadByEmployeId(int employeeId)
        {
            var data = new Business.SupplierPhone().ReadBySupplierId(employeeId);
            var json = new { data };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Update(Entity.SupplierPhone supplierPhone)
        {
            var result = new Business.SupplierPhone().Update(supplierPhone, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Delete(Entity.SupplierPhone supplierPhone)
        {
            var result = new Business.SupplierPhone().Delete(supplierPhone, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }
    }
}