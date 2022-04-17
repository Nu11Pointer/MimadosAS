using System.Web.Mvc;
using Business = BusinessLayer;
using Entity = EntityLayer;


namespace AdminPresentationLayer.Controllers
{
    public class EmployeePhoneController : Controller
    {
        // GET: EmployeePhone
        [HttpPost]
        public JsonResult Create(Entity.EmployeePhone employeePhone)
        {
            var result = new Business.EmployeePhone().Create(employeePhone, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Read()
        {
            var data = new Business.EmployeePhone().Read();
            var json = new { data };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult ReadByEmployeId(int employeeId)
        {
            var data = new Business.EmployeePhone().ReadByEmployeeId(employeeId);
            var json = new { data };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Update(Entity.EmployeePhone employeePhone)
        {
            var result = new Business.EmployeePhone().Update(employeePhone, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Delete(Entity.EmployeePhone employeePhone)
        {
            var result = new Business.EmployeePhone().Delete(employeePhone, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }
    }
}