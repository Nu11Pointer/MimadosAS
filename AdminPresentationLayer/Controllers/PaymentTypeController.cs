using System.Web.Mvc;
using Business = BusinessLayer;
using Entity = EntityLayer;

namespace AdminPresentationLayer.Controllers
{
    public class PaymentTypeController : Controller
    {
        // GET: PaymentType
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Create(Entity.PaymentType paymentType)
        {
            var result = new Business.PaymentType().Create(paymentType, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Read()
        {
            var json = new
            {
                data = new Business.PaymentType().Read()
            };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Update(Entity.PaymentType paymentType)
        {
            var result = new Business.PaymentType().Update(paymentType, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Delete(Entity.PaymentType paymentType)
        {
            var result = new Business.PaymentType().Delete(paymentType, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }
    }
}