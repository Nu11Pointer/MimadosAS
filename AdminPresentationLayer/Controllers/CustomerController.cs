using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Business = BusinessLayer;
using Entity = EntityLayer;

namespace AdminPresentationLayer.Controllers
{
    public class CustomerController : Controller
    {
        // GET: Customer
        #region Customer
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult ReadCustomers()
        {
            var data = new Business.Customer().Read();
            var json = new { data };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult CreateCustomer(Entity.Customer customer)
        {
            var result = new Business.Customer().Create(customer, out string message);
            var json = new { result, message};
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult UpdateCustomer(Entity.Customer customer)
        {
            var result = new Business.Customer().Update(customer, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult DeleteCustomer(Entity.Customer customer)
        {
            var result = new Business.Customer().Delete(customer, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}