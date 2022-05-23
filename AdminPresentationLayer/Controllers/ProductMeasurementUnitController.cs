using System.Web.Mvc;
using Business = BusinessLayer;
using Entity = EntityLayer;

namespace AdminPresentationLayer.Controllers
{
    public class ProductMeasurementUnitController : Controller
    {
        // GET: ProductMeasurementUnit
        [HttpGet]
        public JsonResult Read()
        {
            var json = new
            {
                data = new Business.ProductMeasurementUnit().Read()
            };
            return Json(json, JsonRequestBehavior.AllowGet);
        }
    }
}