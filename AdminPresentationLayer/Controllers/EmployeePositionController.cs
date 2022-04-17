using System.Web.Mvc;
using Business = BusinessLayer;
using Entity = EntityLayer;

namespace AdminPresentationLayer.Controllers
{
    public class EmployeePositionController : Controller
    {
        // GET: EmployeePosition
        [HttpGet]
        public JsonResult Read()
        {
            var data = new Business.EmployeePosition().Read();
            var json = new { data };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Create(Entity.EmployeePosition employeePosition)
        {
            var result = new Business.EmployeePosition().Create(employeePosition, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Update(Entity.EmployeePosition employeePosition)
        {
            var result = new Business.EmployeePosition().Update(employeePosition, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Delete(Entity.EmployeePosition employeePosition)
        {
            var result = new Business.EmployeePosition().Delete(employeePosition, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }
    }
}