using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Web.Mvc;

namespace AdminPresentationLayer.Controllers
{
    public class BarCodeController : Controller
    {
        // GET: BarCode
        [HttpGet]
        public JsonResult Generate(int id = 0)
        {
            // Escribir el id en formato relleno de 5 ej: 00001
            var barcode = id.ToString("D5");
            using (MemoryStream ms = new MemoryStream())
            {
                // El Bitmap tiene el tamaño en base al texto recibido
                using (Bitmap bitMap = new Bitmap(barcode.Length * 40, 80))
                {
                    // Utilizar una instancia de Graphics para dibujar sobre Image
                    using (Graphics graphics = Graphics.FromImage(bitMap))
                    {
                        // Utilizar la fuente instalada
                        Font oFont = new Font("IDAutomationHC39M", 16);
                        PointF point = new PointF(2f, 2f);

                        // Pintar todo el bitmap de blanco
                        SolidBrush whiteBrush = new SolidBrush(Color.White);
                        graphics.FillRectangle(whiteBrush, 0, 0, bitMap.Width, bitMap.Height);

                        // Dibujar el codigo de barra con la fuente
                        SolidBrush blackBrush = new SolidBrush(Color.Black);
                        graphics.DrawString("*" + barcode + "*", oFont, blackBrush, point);
                    }

                    // Guardar el bitMap en el memory stream
                    bitMap.Save(ms, ImageFormat.Png);

                    // Generar Cadena en base 64
                    barcode = "data:image/png;base64," + Convert.ToBase64String(ms.ToArray());
                }
            }

            return Json(barcode, JsonRequestBehavior.AllowGet);
        }
    }
}