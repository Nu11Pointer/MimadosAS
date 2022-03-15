using System.Web.Mvc;
using Business = BusinessLayer;

namespace AdminPresentationLayer.Controllers
{
    public class DeparmentController : Controller
    {
        // GET: Deparment
        public JsonResult DeparmentRead()
        {
            var json = new
            {
                data = new Business.Deparment().Read()
            };
            return Json(json, JsonRequestBehavior.AllowGet);
        }
    }
}