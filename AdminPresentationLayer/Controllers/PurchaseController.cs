using AdminPresentationLayer.Models;
using ClosedXML.Excel;
using Rotativa;
using System;
using System.Data;
using System.IO;
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
            var branchOffice = new Business.BranchOffice().ReadById(Employee.BranchOffice.Id);
            var Supplier = new Business.Supplier().ReadById(Purchase.Supplier.Id);
            Purchase.PurchaseDetails = new Business.Purchase().Detail(Purchase.Id);
            Employee.BranchOffice = branchOffice;
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

        [HttpPost]
        public JsonResult Fetch(string start, string end)
        {
            var data = new Business.Purchase().Fetch(start, end);
            var json = new { data };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        public ActionResult PurchaseHistory()
        {
            return View();
        }

        [HttpGet]
        public FileResult Excel(string start, string end)
        {
            var sales = new Business.Purchase().Fetch(start, end);
            var dt = new DataTable
            {
                Locale = new System.Globalization.CultureInfo("es-NI")
            };
            dt.Columns.Add("N° Compra", typeof(int));
            dt.Columns.Add("Fecha", typeof(string));
            dt.Columns.Add("Proveedor", typeof(string));
            dt.Columns.Add("Empleado", typeof(string));
            dt.Columns.Add("Total C$", typeof(decimal));

            foreach (var sale in sales)
            {
                dt.Rows.Add(new object[]
                {
                    sale.Id,
                    sale.StringTimeStamp,
                    sale.Supplier.Name,
                    sale.Employee.FullName,
                    sale.Total
                });
            }

            dt.TableName = "Compras";

            using (XLWorkbook wb = new XLWorkbook())
            {
                wb.Worksheets.Add(dt);
                using (MemoryStream stream = new MemoryStream())
                {
                    wb.SaveAs(stream);
                    return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"compras_{DateTime.Now.ToShortDateString()}.xlsx");
                }
            }
        }

        public ActionResult Report(string start, string end)
        {
            return new ActionAsPdf("TablePurchaseHistory", new { start, end })
            {
                FileName = $"ventas_{DateTime.Now.ToShortDateString()}.pdf",
                PageSize = Rotativa.Options.Size.A4
            };
        }

        public ActionResult TablePurchaseHistory(string start, string end)
        {
            var purchases = new Business.Purchase().Fetch(start, end);
            var tabla = new PurchaseHistoryTable()
            {
                Purchase = purchases,
                Start = "01/01/2022 00:00:00 am",
                End = "31/12/2022 23:59:59 pm"
            };
            return View(tabla);
        }
    }
}