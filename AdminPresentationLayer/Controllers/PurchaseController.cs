using System.Web.Mvc;
using Business = BusinessLayer;
using Entity = EntityLayer;

namespace AdminPresentationLayer.Controllers
{
    public class PurchaseController : Controller
    {
        // GET: Purchase
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult Read()
        {
            var data = new Business.Purchase().Read();
            var json = new { data };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Create(Entity.Purchase purchase)
        {
            var result = new Business.Purchase().Create(purchase, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Update(Entity.Purchase purchase)
        {
            var result = new Business.Purchase().Update(purchase, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Delete(Entity.Purchase purchase)
        {
            var result = new Business.Purchase().Delete(purchase, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }
    }
}