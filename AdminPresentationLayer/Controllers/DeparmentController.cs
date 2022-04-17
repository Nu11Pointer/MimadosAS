using System.Web.Mvc;
using Business = BusinessLayer;
using Entity = EntityLayer;

namespace AdminPresentationLayer.Controllers
{
    public class DeparmentController : Controller
    {
        // GET: Deparment
        public ActionResult Index()
        {
            return View();
        }
        //[HttpGet]
        //public JsonResult DeparmentRead()
        //{
        //    var json = new
        //    {
        //        data = new Business.Deparment().Read()
        //    };
        //    return Json(json, JsonRequestBehavior.AllowGet);
        //}

        [HttpPost]
        public JsonResult Create(Entity.Department department)
        {
            var result = new Business.Deparment().Create(department, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Read()
        {
            var json = new
            {
                data = new Business.Deparment().Read()
            };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Update(Entity.Department department)
        {
            var result = new Business.Deparment().Update(department, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Delete(Entity.Department department)
        {
            var result = new Business.Deparment().Delete(department, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }
    }
}