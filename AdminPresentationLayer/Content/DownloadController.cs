using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AdminPresentationLayer.Content
{
    public class DownloadController : Controller
    {
        // GET: Download
        public FileResult UserManual()
        {
            var PathFile = "~/Content/Manual de usuario.pdf";
            return File(PathFile, "application/force- download", Path.GetFileName(PathFile));
        }
    }
}