using System.Linq;
using System.Web.Mvc;
using Business = BusinessLayer;
using Entity = EntityLayer;

namespace AdminPresentationLayer.Controllers
{
    public class ReportsController : Controller
    {
        // GET: Reports
        [HttpGet]
        public JsonResult Expense()
        {
            var json = new
            {
                data = new Business.Expense().Read()
            };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Earning()
        {
            var json = new
            {
                data = new Business.Earning().Read()
            };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult ProductsTotalSales()
        {
            var json = new
            {
                data = new Business.Product().TotalSales().Take(3)
            };
            return Json(json, JsonRequestBehavior.AllowGet);
        }
    }
}