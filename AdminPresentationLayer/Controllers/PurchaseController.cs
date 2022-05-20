using System.Linq;
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

        [HttpPost]
        public JsonResult Create(Entity.Purchase Purchase)
        {
            var result = new Business.Purchase().Create(Purchase, out string message, out int id);
            var json = new { result, message, id };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult Invoce(int id)
        {
            var Purchase = new Business.Purchase().ReadById(id);
            var Employee = new Business.Employee().ReadById(Purchase.Employee.Id);
            var Supplier = new Business.Supplier().ReadById(Purchase.Supplier.Id);
            Purchase.PurchaseDetails = new Business.Purchase().Detail(Purchase.Id);
            Employee.BranchOffice.Phones = new Business.BranchOfficePhone().ReadByBranchOffice(Employee.BranchOffice.Id).Where(p => p.Active).ToList();
            Purchase.Employee = Employee;
            Purchase.Supplier = Supplier;
            Purchase.Supplier.Phones = new Business.SupplierPhone().ReadBySupplierId(Purchase.Supplier.Id);
            return View(Purchase);
        }

        [HttpGet]
        public JsonResult Read()
        {
            var data = new Business.Purchase().Read();
            var json = new { data };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        public ActionResult PurchaseHistory()
        {
            return View();
        }
    }
}