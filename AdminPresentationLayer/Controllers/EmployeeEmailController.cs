using System.Web.Mvc;
using Business = BusinessLayer;
using Entity = EntityLayer;

namespace AdminPresentationLayer.Controllers
{
    public class EmployeeEmailController : Controller
    {
        // GET: EmployeeEmail
        [HttpPost]
        public JsonResult Create(Entity.EmployeeEmail employeeEmail)
        {
            var result = new Business.EmployeeEmail().Create(employeeEmail, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Read()
        {
            var data = new Business.EmployeeEmail().Read();
            var json = new { data };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult ReadByEmployeId(int employeeId)
        {
            var data = new Business.EmployeeEmail().ReadByEmployeeId(employeeId);
            var json = new { data };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Update(Entity.EmployeeEmail employeeEmail)
        {
            var result = new Business.EmployeeEmail().Update(employeeEmail, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Delete(Entity.EmployeeEmail employeeEmail)
        {
            var result = new Business.EmployeeEmail().Delete(employeeEmail, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }
    }
}