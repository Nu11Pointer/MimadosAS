using System.Web.Mvc;
using Entity = EntityLayer;
using Business = BusinessLayer;

namespace AdminPresentationLayer.Controllers
{
    public class MunicipalityController : Controller
    {
        // GET: Municipality
        [HttpPost]
        public JsonResult Create(Entity.Municipality municipality)
        {
            var result = new Business.Municipality().Create(municipality, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Read()
        {
            var json = new
            {
                data = new Business.Municipality().Read()
            };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult ReadByDepartment(int deparmentId)
        {
            var json = new
            {
                data = new Business.Municipality().ReadByDepartment(deparmentId)
            };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Update(Entity.Municipality municipality)
        {
            var result = new Business.Municipality().Update(municipality, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Delete(Entity.Municipality municipality)
        {
            var result = new Business.Municipality().Delete(municipality, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }
    }
}