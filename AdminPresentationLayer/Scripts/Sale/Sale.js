var tablaproducto;
var tablacliente;
var currentClient;
var currentEmployee;
var SaleDetail = []

$(document).ready(function () {

    $("#txtproductocantidad").val("0");
    $("#txtfechaventa").val(ObtenerFecha());


    LoadEmployee()
    LoadCustomers()
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

function LoadCustomers() {
    tablacliente = $('#tbcliente').DataTable({
        responsive: true,
        ordering: true,
        "ajax": {
            url: '/Customer/ReadCustomers',
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
            { "data": "SurName" },
            { "data": "Name" },
            { "data": "Address" }
        ],
        "columnDefs": [
        { "width": "10%", "targets": [0, 1] }
        ],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.4/i18n/es_es.json"
        },
        "order": [[ 1, "asc" ]]
    });
}

$('#btnBuscarCliente').on('click', function () {

    tablacliente.ajax.reload();

    $('#modalCliente').modal('show');
})

$('#modalCliente').on('shown.bs.modal', function() {
    tablaproducto.columns.adjust().responsive.recalc();
});

function clienteSelect(json) {

    currentClient = json;

    $("#txtclientedocumento").val(currentClient.SurName);
    $("#txtclientenombres").val(currentClient.Name);
    $("#txtclientedireccion").val(currentClient.Address);
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
                    return "<button class='btn btn-sm btn-success' type='button' onclick='productoSelect(" + JSON.stringify(row) + ")'><i class='fas fa-check'></i></button>"
                },
                "orderable": false,
                "searchable": false
            },
            { "data": "Id"},
            { "data": "Name", render: name => name.length > 15 ? name.substring(0, 15) + '...' : name },
            { "data": "SalePrice", "render": value => "C$" + value.toFixed(2)},
            { "data": "Stock" },
            { "data": "ProductCategory.Name", render: name => name.length > 15 ? name.substring(0, 15) + '...' : name },
            { "data": "ProductBrand.Name", render: name => name.length > 15 ? name.substring(0, 15) + '...' : name }
        ],
        "columnDefs": [
        { "width": "50%", "targets": 2 }
        ],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.4/i18n/es_es.json"
        },
        "order": [[ 1, "asc" ]]
    });
}

$('#modalProducto').on('shown.bs.modal', function() {
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
    //$("#txtproductodescripcion").val(json.Name);
    $("#txtproductostock").val(json.Stock);
    $("#txtproductoprecio").val(json.SalePrice);
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
    var subtotal = 0;
    var igv = 0;
    var sumatotal = 0;
    $('#tbVenta > tbody  > tr').each(function (index, tr) {
        var fila = tr;
        var importetotal = parseFloat($(fila).find("td.importetotal").text().substring(3));
        sumatotal = sumatotal + importetotal;
    });
    subtotal = sumatotal / 1.15;
    igv = subtotal * 1.15 - subtotal;


    $("#txtsubtotal").val(subtotal.toFixed(2));
    $("#txtigv").val(igv.toFixed(2));
    $("#txttotal").val(sumatotal.toFixed(2));
}

$('#btnAgregar').on('click', function () {

    $("#txtproductocantidad").val($("#txtproductocantidad").val() == "" ? "0" : $("#txtproductocantidad").val());

    var existe_codigo = false;

    if (
        parseInt($("#txtIdProducto").val()) == 0 ||
        parseInt($("#txtproductocantidad").val()) == 0 ||
        !Number.isInteger(parseInt($("#txtproductocantidad").val()))
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
            SaleId: 0,
            ProductId: parseInt($("#txtIdProducto").val()),
            SalePrice: $("#txtproductoprecio").val(),
            Quantity: parseInt($("#txtproductocantidad").val())
        };

        SaleDetail.push(Item)

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
        $("#txtproductocantidad").val("0");

        $("#txtproductocodigo").focus();

        calcularPrecios();
    } else {
        swal("Mensaje", "El producto ya existe en la venta", "warning")
    }
})

$('#tbVenta tbody').on('click', 'button[class="btn btn-danger btn-sm"]', function () {
    var idproducto = $(this).data("idproducto");
    var cantidadproducto = $(this).data("cantidadproducto");

    //controlarStock(idproducto, parseInt($("#txtIdTienda").val()), cantidadproducto, false);
    $(this).parents("tr").remove();

    calcularPrecios();
})

function calcularCambio() {
    var montopago = $("#txtmontopago").val().trim() == "" ? 0 : parseFloat($("#txtmontopago").val().trim());
    var totalcosto = parseFloat($("#txttotal").val().trim());
    if (totalcosto < 0) {
        var cambio = 0;
        $("#txtcambio").val(cambio.toFixed(2));
        return
    }
    var cambio = 0;
    cambio = (montopago <= totalcosto ? totalcosto : montopago) - totalcosto;

    $("#txtcambio").val(cambio.toFixed(2));
}

$('#btncalcular').on('click', function () {
    calcularCambio();
})


$('#btnTerminarGuardarVenta').on('click', function () {

    //VALIDACIONES DE CLIENTE
    if ($("#txtclientedocumento").val().trim() == "" || $("#txtclientenombres").val().trim() == "") {
        swal("Mensaje", "Complete los datos del cliente", "warning");
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

    var $totalproductos = 0;
    var $totalimportes = 0;

    var DETALLE = "";
    var VENTA = "";
    var DETALLE_CLIENTE = "";
    var DETALLE_VENTA = "";
    var DATOS_VENTA = "";

    calcularCambio();

    var sale = {
        Id: 0,
        Currency : {
            Id : 1
        },
        PaymentType : {
            Id : 1
        },
        Customer : currentClient,
        Employee : currentEmployee,
        SaleDetails : SaleDetail,
        Payment : parseFloat($("#txtmontopago").val())
    }

    console.log(sale)

    jQuery.ajax({
        url: '/Sale/Create',
        type: "POST",
        data: JSON.stringify({ sale: sale }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {

            $(".card-venta").LoadingOverlay("hide");

            if (response.result) {

                //CLIENTE
                $("#txtclientedocumento").val("");
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
                $("#txtigv").val("0.00");
                $("#txttotal").val("0.00");
                $("#txtmontopago").val("");
                $("#txtcambio").val("0.00");


                $("#tbVenta tbody").html("");
           
                var url = "/Sale/Invoce";
                window.open(url);

                swal("\nLa venta fue realizada con exito", "\n", "success");
            }
            else {
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