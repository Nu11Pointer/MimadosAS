using System.Web.Mvc;
using Business = BusinessLayer;
using Entity = EntityLayer;

namespace AdminPresentationLayer.Controllers
{
    public class ProductPackagingController : Controller
    {
        // GET: ProductPackaging
        [HttpGet]
        public JsonResult Read()
        {
            var json = new
            {
                data = new Business.ProductPackaging().Read()
            };
            return Json(json, JsonRequestBehavior.AllowGet);
        }
    }
}