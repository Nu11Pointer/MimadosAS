using System.Web.Mvc;
using System.Xml.Serialization;
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

        public ActionResult Invoce()
        {

            //Venta oVenta = CD_Venta.Instancia.ObtenerDetalleVenta(IdVenta);



            //NumberFormatInfo formato = new CultureInfo("es-PE").NumberFormat;
            //formato.CurrencyGroupSeparator = ".";


            //if (oVenta == null)
            //    oVenta = new Venta();
            //else
            //{

            //    oVenta.oListaDetalleVenta = (from dv in oVenta.oListaDetalleVenta
            //                                 select new DetalleVenta()
            //                                 {
            //                                     Cantidad = dv.Cantidad,
            //                                     NombreProducto = dv.NombreProducto,
            //                                     PrecioUnidad = dv.PrecioUnidad,
            //                                     TextoPrecioUnidad = dv.PrecioUnidad.ToString("N", formato), //numero.ToString("C", formato)
            //                                     ImporteTotal = dv.ImporteTotal,
            //                                     TextoImporteTotal = dv.ImporteTotal.ToString("N", formato)
            //                                 }).ToList();

            //    oVenta.TextoImporteRecibido = oVenta.ImporteRecibido.ToString("N", formato);
            //    oVenta.TextoImporteCambio = oVenta.ImporteCambio.ToString("N", formato);
            //    oVenta.TextoTotalCosto = oVenta.TotalCosto.ToString("N", formato);
            //}


            //return View(oVenta);
            var sale = new Entity.Sale()
            {
                Id = 1432,
                TimeStamp = System.DateTime.Now,
                Employee = new Entity.Employee()
                {
                    Name = "Jose Bismarck",
                    SurName = "Lacayo Lopez",
                    BranchOffice = new Entity.BranchOffice()
                    {
                        Address = "Esto es una dirección de prueba."
                    }
                },
                Customer = new Entity.Customer()
                {
                    Name = "Steven Alexander",
                    SurName = "Mendez Paiz"
                }
            };
            return View(sale);
        }
    }
}