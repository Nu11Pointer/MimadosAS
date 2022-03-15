using System.Web.Mvc;
using Business = BusinessLayer;

namespace AdminPresentationLayer.Controllers
{
    public class MunicipalityController : Controller
    {
        // GET: Municipality
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
    }
}