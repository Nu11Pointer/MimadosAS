using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Business = BusinessLayer;
using Entity = EntityLayer;

namespace AdminPresentationLayer.Controllers
{
    public class SaleController : Controller
    {
        // GET: Sale
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Create(Entity.Sale sale)
        {
            var result = new Business.Sale().Create(sale, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult Invoce(int id)
        {
            var sale = new Business.Sale().ReadById(id);
            var Employee = new Business.Employee().ReadById(sale.Employee.Id);
            var Customer = new Business.Customer().ReadById(sale.Customer.Id);
            sale.SaleDetails = new Business.Sale().Detail(sale.Id);
            Employee.BranchOffice.Phones = new Business.BranchOfficePhone().ReadByBranchOffice(Employee.BranchOffice.Id).Where(p => p.Active).ToList();
            sale.Customer = Customer;
            sale.Employee = Employee;
            return View(sale);
        }
    }
}