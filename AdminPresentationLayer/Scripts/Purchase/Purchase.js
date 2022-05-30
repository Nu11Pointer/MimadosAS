var tablaproducto;
var tablaproveedores;
var currentSupplier;
var currentEmployee;
var PurchaseDetail = []

$(document).ready(function () {
    // Pintar Menu Collapse
    $('#CollapseMenuSupplier').addClass('active');
    $('#collapseSix').addClass('show');
    $('#CollapseMenuItemPurchase').addClass('active');

    $("#txtproductocantidad").val("0");
    $("#txtfechaventa").val(ObtenerFecha());


    LoadEmployee()
    LoadSuppliers()
    LoadProducts()
})

function ObtenerFecha() {

    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var output = (('' + day).length < 2 ? '0' : '') + day + '/' + (('' + month).length < 2 ? '0' : '') + month + '/' + d.getFullYear();

    return output;
}

function LoadEmployee() {
    // Load Selector Employee
    jQuery.ajax({
        url: '/Employee/ReadById',
        type: "POST",
        data: JSON.stringify({ id: 35 }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            currentEmployee = response.data
            $("#txtIdTienda").val(response.data.BranchOffice.Id);
            $("#lbltiendanombre").text(response.data.BranchOffice.Name);

            $("#txtIdUsuario").val(response.data.Id);
            $("#lblempleadonombre").text(response.data.Name);
            $("#lblempleadoapellido").text(response.data.SurName);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function LoadSuppliers() {
    tablaproveedores = $('#tbcliente').DataTable({
        responsive: true,
        ordering: true,
        "ajax": {
            url: '/Supplier/Read',
            type: "GET",
            dataType: "json"
        },
        "columns": [
            {
                "data": "Id", render: function (data, type, row, meta) {
                    return "<button class='btn btn-sm btn-success' type='button' onclick='clienteSelect(" + JSON.stringify(row) + ")'><i class='fas fa-check'></i></button>"
                },
                "orderable": false,
                "searchable": false
            },
            { "data": "Id" },
            { "data": "Name" },
            { "data": "Address" }
        ],
        "columnDefs": [
            { "width": "10%", "targets": [0, 1] }
        ],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.4/i18n/es_es.json"
        },
        "order": [[1, "asc"]]
    });
}

$('#btnBuscarCliente').on('click', function () {

    tablaproveedores.ajax.reload();

    $('#modalCliente').modal('show');
})

$('#modalCliente').on('shown.bs.modal', function () {
    tablaproveedores.columns.adjust().responsive.recalc();
});

function clienteSelect(json) {

    currentSupplier = json;

    $("#txtclientenombres").val(currentSupplier.Name);
    $("#txtclientedireccion").val(currentSupplier.Address);
    $('#modalCliente').modal('hide');
}

function LoadProducts() {
    tablaproducto = $('#tbProducto').DataTable({
        responsive: true,
        ordering: true,
        "ajax": {
            url: '/Product/Read',
            type: "GET",
            dataType: "json"
        },
        "columns": [
            {
                "data": "Id", render: function (data, type, row, meta) {
                    var json = JSON.stringify(row);
                    return "<button class='btn btn-sm btn-success' type='button' onclick='productoSelect(" + json + ")'><i class='fas fa-check'></i></button>"
                },
                "orderable": false,
                "searchable": false
            },
            { "data": "Id" },
            { "data": "Name", render: name => name.length > 40 ? name.substring(0, 40) + '...' : name },
            { "data": "ProductCategory.Name" },
            { "data": "ProductBrand.Name" },
            { "data": "StringNetContent" }
        ],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.4/i18n/es_es.json"
        },
        "order": [[1, "asc"]]
    });
}

$('#modalProducto').on('shown.bs.modal', function () {
    tablaproducto.columns.adjust().responsive.recalc();
});

$('#btnBuscarProducto').on('click', function () {
    tablaproducto.ajax.url('/Product/Read').load();
    $('#modalProducto').modal('show');

})

function productoSelect(json) {
    $("#txtIdProducto").val(json.Id);
    $("#txtproductocodigo").val(json.Id);
    $("#txtproductonombre").val(json.Name);
    $("#txtproductodescripcion").val(json.ProductPackaging.Name);
    $("#txtproductocantidad").val("0");
    $('#modalProducto').modal('hide');
}

function controlarStock($idproducto, $idtienda, $cantidad, $restar) {

    var request = {
        idproducto: $idproducto,
        idtienda: $idtienda,
        cantidad: $cantidad,
        restar: $restar
    }

    return

    jQuery.ajax({
        url: $.MisUrls.url._ControlarStockProducto,
        type: "POST",
        data: JSON.stringify(request),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {

        },
        error: function (error) {
            console.log(error)
        },
        beforeSend: function () {
        },
    });
}

function calcularPrecios() {
    var sumatotal = 0;
    $('#tbVenta > tbody  > tr').each(function (index, tr) {
        var fila = tr;
        var importetotal = parseFloat($(fila).find("td.importetotal").text().substring(3));
        sumatotal = sumatotal + importetotal;
    });

    $("#txtsubtotal").val(sumatotal.toFixed(2));
    $("#txttotal").val(sumatotal.toFixed(2));
}

$('#btnAgregar').on('click', function () {

    $("#txtproductocantidad").val($("#txtproductocantidad").val() == "" ? "0" : $("#txtproductocantidad").val());

    var existe_codigo = false;

    if (
        parseInt($("#txtIdProducto").val()) == 0 ||
        parseInt($("#txtproductocantidad").val()) == 0 ||
        !Number.isInteger(parseInt($("#txtproductocantidad").val())) ||
        $("#txtproductoprecio").val().match(/^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/g) == null
    ) {
        swal("Mensaje", "Debe completar todos los campos del producto", "warning")
        return;
    }

    $('#tbVenta > tbody  > tr').each(function (index, tr) {

        var fila = tr;
        var idproducto = $(fila).find("td.producto").data("idproducto");

        if (idproducto == $("#txtIdProducto").val()) {
            existe_codigo = true;
            return false;
        }

    });

    if (!existe_codigo) {

        //controlarStock(parseInt($("#txtIdProducto").val()), parseInt($("#txtIdTienda").val()), parseInt($("#txtproductocantidad").val()), true);

        var importetotal = parseFloat($("#txtproductoprecio").val()) * parseFloat($("#txtproductocantidad").val());

        var Item = {
            PurchaseId: 0,
            Product: {
                Id: parseInt($("#txtIdProducto").val())
            },
            PurchasePrice: $("#txtproductoprecio").val(),
            Quantity: parseInt($("#txtproductocantidad").val())
        };

        PurchaseDetail.push(Item)

        $("<tr>").append(
            $("<td>").append(
                $("<button>").addClass("btn btn-danger btn-sm").text("Eliminar").data("idproducto", parseInt($("#txtIdProducto").val())).data("cantidadproducto", parseInt($("#txtproductocantidad").val()))
            ),
            $("<td>").addClass("productocantidad").text(parseInt($("#txtproductocantidad").val())),
            $("<td>").addClass("producto").data("idproducto", $("#txtIdProducto").val()).text($("#txtproductonombre").val()),
            $("<td>").text($("#txtproductodescripcion").val()),
            $("<td>").addClass("productoprecio").text("C$ " + $("#txtproductoprecio").val()),
            $("<td>").addClass("importetotal").text("C$ " + importetotal)
        ).appendTo("#tbVenta tbody");

        $("#txtIdProducto").val("0");
        $("#txtproductocodigo").val("");
        $("#txtproductonombre").val("");
        $("#txtproductodescripcion").val("NO DISPONIBLE");
        $("#txtproductostock").val("");
        $("#txtproductoprecio").val("");
        $("#txtproductocantidad").val("");

        $("#txtproductocodigo").focus();

        calcularPrecios();
    } else {
        swal("Mensaje", "El producto ya existe en la venta", "warning")
    }
})

$('#tbVenta tbody').on('click', 'button[class="btn btn-danger btn-sm"]', function () {
    var idproducto = $(this).data("idproducto");
    $(this).parents("tr").remove();
    PurchaseDetail = PurchaseDetail.filter(Item => Item.Product.Id != idproducto);
    calcularPrecios();
})

function calcularCambio() {
    var montopago = $("#txtmontopago").val().trim() == "" ? 0 : parseFloat($("#txtmontopago").val().trim());
    var totalcosto = parseFloat($("#txttotal").val().trim());
    var cambio = 0;
    cambio = (montopago <= totalcosto ? totalcosto : montopago) - totalcosto;
    $("#txtcambio").val(cambio.toFixed(2));
}

$('#btnTerminarGuardarVenta').on('click', function () {

    //VALIDACIONES DE PROVEEDOR
    if ($("#txtclientenombres").val().trim() == "") {
        swal("Mensaje", "Complete los datos del proveedor", "warning");
        return;
    }
    //VALIDACIONES DE PRODUCTOS
    if ($('#tbVenta tbody tr').length == 0) {
        swal("Mensaje", "Debe registrar minimo un producto en la venta", "warning");
        return;
    }

    //VALIDACIONES DE MONTO PAGO
    if ($("#txtmontopago").val().trim() == "") {
        swal("Mensaje", "Ingrese el monto de pago", "warning");
        return;
    }

    calcularCambio();

    var Purchase = {
        Id: 0,
        Currency: {
            Id: 1
        },
        PaymentType: {
            Id: 1
        },
        Supplier: currentSupplier,
        Employee: currentEmployee,
        PurchaseDetails: PurchaseDetail,
        Payment: parseFloat($("#txtmontopago").val())
    }

    console.log(Purchase)

    jQuery.ajax({
        url: '/Purchase/Create',
        type: "POST",
        data: JSON.stringify({ purchase: Purchase }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {

            $(".card-venta").LoadingOverlay("hide");

            if (response.result) {

                //PROVEEDOR
                $("#txtclientenombres").val("");
                $("#txtclientedireccion").val("");

                //PRODUCTO
                $("#txtIdProducto").val("0");
                $("#txtproductocodigo").val("");
                $("#txtproductonombre").val("");
                $("#txtproductodescripcion").val("");
                $("#txtproductostock").val("");
                $("#txtproductoprecio").val("");
                $("#txtproductocantidad").val("0");

                //PRECIOS
                $("#txtsubtotal").val("0.00");
                $("#txttotal").val("0.00");
                $("#txtmontopago").val("");
                $("#txtcambio").val("0.00");


                $("#tbVenta tbody").html("");
                PurchaseDetail = []
                var url = "/Purchase/Invoce?id=" + response.id;

                swal("\nLa compra fue registrada con exito", "\n", "success");

                window.open(url);
            }
            else {
                console.log(response.message)
                swal("Error", "\n" + response.message, "danger");
            }
        },
        error: function (error) {
            console.log(error)
            $(".card-venta").LoadingOverlay("hide")
        },
        beforeSend: function () {
            $(".card-venta").LoadingOverlay("show");
        }
    });
})
