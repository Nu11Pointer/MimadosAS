using ClosedXML.Excel;
using System;
using System.Data;
using System.IO;
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
            var result = new Business.Sale().Create(sale, out string message, out int id);
            var json = new { result, message, id };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult Invoce(int id)
        {
            var sale = new Business.Sale().ReadById(id);
            var employee = new Business.Employee().ReadById(sale.Employee.Id);
            var branchOffice = new Business.BranchOffice().ReadById(employee.BranchOffice.Id);
            sale.SaleDetails = new Business.Sale().Detail(sale.Id);
            employee.BranchOffice = branchOffice;
            employee.BranchOffice.Phones = new Business.BranchOfficePhone().ReadByBranchOffice(employee.BranchOffice.Id).Where(p => p.Active).ToList();
            sale.Employee = employee;
            return View(sale);
        }

        [HttpGet]
        public JsonResult Read()
        {
            var data = new Business.Sale().Read();
            var json = new { data };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Fetch(string start, string end)
        {
            var data = new Business.Sale().Fetch(start, end);
            var json = new { data };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public FileResult Excel(string start, string end)
        {
            var sales = new Business.Sale().Fetch(start, end);
            var dt = new DataTable
            {
                Locale = new System.Globalization.CultureInfo("es-NI")
            };
            dt.Columns.Add("N° Venta", typeof(int));
            dt.Columns.Add("Fecha", typeof(string));
            dt.Columns.Add("Cliente", typeof(string));
            dt.Columns.Add("Empleado", typeof(string));
            dt.Columns.Add("Total C$", typeof(decimal));

            foreach (var sale in sales)
            {
                dt.Rows.Add(new object[]
                {
                    sale.Id,
                    sale.StringTimeStamp,
                    sale.Customer.FullName,
                    sale.Employee.FullName,
                    sale.Total
                });
            }

            dt.TableName = "Ventas";

            using (XLWorkbook wb = new XLWorkbook())
            {
                wb.Worksheets.Add(dt);
                using (MemoryStream stream = new MemoryStream())
                {
                    wb.SaveAs(stream);
                    return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"ventas{DateTime.Now}.xlsx");
                }
            }
        }

        public ActionResult SaleHistory()
        {
            return View();
        }
    }
}
