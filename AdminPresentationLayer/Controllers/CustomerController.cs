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

        #region CustomerPhone
        [HttpGet]
        public JsonResult ReadCustomerPhones()
        {
            var data = new Business.CustomerPhone().Read();
            var json = new { data };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult ReadCustomerPhonesByCustomerId(int customerId)
        {
            var data = new Business.CustomerPhone().ReadByCustomer(customerId);
            var json = new { data };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult CreateCustomerPhone(Entity.CustomerPhone customerPhone)
        {
            var result = new Business.CustomerPhone().Create(customerPhone, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult UpdateCustomerPhone(Entity.CustomerPhone customerPhone)
        {
            var result = new Business.CustomerPhone().Update(customerPhone, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult DeleteCustomerPhone(Entity.CustomerPhone customerPhone)
        {
            var result = new Business.CustomerPhone().Delete(customerPhone, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region CustomerEmail
        [HttpGet]
        public JsonResult ReadCustomerEmails()
        {
            var data = new Business.CustomerEmail().Read();
            var json = new { data };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult ReadCustomerEmailsByCustomerId(int customerId)
        {
            var data = new Business.CustomerEmail().ReadByCustomer(customerId);
            var json = new { data };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult CreateCustomerEmail(Entity.CustomerEmail customerEmail)
        {
            var result = new Business.CustomerEmail().Create(customerEmail, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult UpdateCustomerEmail(Entity.CustomerEmail customerEmail)
        {
            var result = new Business.CustomerEmail().Update(customerEmail, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult DeleteCustomerEmail(Entity.CustomerEmail customerEmail)
        {
            var result = new Business.CustomerEmail().Delete(customerEmail, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}