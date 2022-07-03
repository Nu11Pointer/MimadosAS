var tablaproducto;
var tablaproveedores;
var currentSupplier;
var currentEmployee;
var PurchaseDetail = [];
var user;

$(document).ready(function () {
    // Pintar Menu Collapse
    $('#CollapseMenuSales').addClass('active');
    $('#collapseSeven').addClass('show');
    $('#CollapseMenuItemSales').addClass('active');

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

    var SetEmplee = function () {
        // Load Selector Employee
        jQuery.ajax({
            url: '/Employee/ReadById',
            type: "POST",
            data: JSON.stringify({ id: user.Employee.Id }),
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

    jQuery.ajax({
        url: '/User/Me',
        type: "GET",
        success: function (data) {
            user = data;
            SetEmplee();
        },
        error: function (_) {
        }
    });
}

function LoadSuppliers() {
    tablaproveedores = $('#tbcliente').DataTable({
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
        "order": [[1, "asc"]]
    });
}

$('#btnBuscarCliente').on('click', function () {

    tablaproveedores.ajax.reload();

    $('#modalCliente').modal('show');
})

$('#modalCliente').on('shown.bs.modal', function () {
    tablaproducto.columns.adjust().responsive.recalc();
});

function clienteSelect(json) {

    currentSupplier = json;

    $("#txtclientedocumento").val(currentSupplier.SurName);
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
            { "data": "Name", render: name => name.length > 15 ? name.substring(0, 15) + '...' : name },
            { "data": "SalePrice", "render": value => value.toFixed(2) },
            { "data": "StringNetContent" },
            { "data": "ProductCategory.Name", render: name => name.length > 15 ? name.substring(0, 15) + '...' : name },
            { "data": "ProductBrand.Name", render: name => name.length > 15 ? name.substring(0, 15) + '...' : name },
            { "data": "Stock" }
        ],
        "columnDefs": [
            { "width": "50%", "targets": 2 }
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
    $("#txtproductodescripcion").val(json.StringNetContent);
    $("#txtproductostock").val(json.Stock);
    $("#txtproductoprecio").val(json.SalePrice);
    $("#txtproductocantidad").val("0");
    $('#modalProducto').modal('hide');
}

function controlarStock(idProduct, quantity) {
    jQuery.ajax({
        url: '/Product/StockControl',
        type: "POST",
        data: JSON.stringify({ idProduct: idProduct, quantity: quantity }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (_) {
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
    var fila;
    if (
        parseInt($("#txtIdProducto").val()) == 0 ||
        parseInt($("#txtproductocantidad").val()) == 0 ||
        !Number.isInteger(parseInt($("#txtproductocantidad").val()))
    ) {
        swal("¡Atención!", "Debe completar todos los campos del producto", "warning");
        return;
    }

    if (parseInt($("#txtproductocantidad").val()) > parseInt($("#txtproductostock").val())) {
        swal("¡Demasiados Productos!", "No hay existencias suficinetes.", "warning");
        return
    }

    $('#tbVenta > tbody  > tr').each(function (index, tr) {

        fila = tr;
        var idproducto = $(fila).find("td.producto").data("idproducto");

        if (idproducto == $("#txtIdProducto").val()) {
            existe_codigo = true;
            return false;
        }

    });

    if (!existe_codigo) {

        controlarStock(parseInt($("#txtIdProducto").val()), parseInt($("#txtproductocantidad").val()) * -1);

        var importetotal = parseFloat($("#txtproductoprecio").val()) * parseFloat($("#txtproductocantidad").val());

        var Item = {
            SaleId: 0,
            Product: {
                Id: parseInt($("#txtIdProducto").val())
            },
            SalePrice: $("#txtproductoprecio").val(),
            Quantity: parseInt($("#txtproductocantidad").val())
        };

        PurchaseDetail.push(Item)

        $("<tr>").append(
            $("<td>").append(
                $("<button>").addClass("btn btn-primary btn-circle btn-sm mr-1").append('<i class="fas fa-pen">').data("idproducto", parseInt($("#txtIdProducto").val())).data("cantidadproducto", parseInt($("#txtproductocantidad").val())),
                $("<button>").addClass("btn btn-danger btn-circle btn-sm").append('<i class="fas fa-trash">').data("idproducto", parseInt($("#txtIdProducto").val())).data("cantidadproducto", parseInt($("#txtproductocantidad").val()))
            ),
            $("<td>").addClass("productocantidad").text(parseInt($("#txtproductocantidad").val())),
            $("<td>").addClass("producto").data("idproducto", $("#txtIdProducto").val()).text($("#txtproductonombre").val()),
            $("<td>").text($("#txtproductodescripcion").val()),
            $("<td>").addClass("productoprecio").text("C$ " + $("#txtproductoprecio").val()),
            $("<td>").addClass("importetotal").text("C$ " + importetotal)
        ).appendTo("#tbVenta tbody");
    } else {

        // Obtener los datos viejos
        var td_button = $(fila).find("td").find("button");
        var td_importetotal = $(fila).find("td.importetotal");
        var td_productocantidad = $(fila).find("td.productocantidad");

        controlarStock(parseInt($("#txtIdProducto").val()), parseInt($("#txtproductocantidad").val()) * -1);

        // Calcular los nuevos datos
        var cantidadproducto = td_button.data("cantidadproducto") + parseInt($("#txtproductocantidad").val());
        var importetotal = parseFloat($("#txtproductoprecio").val()) * cantidadproducto;

        // Actualizar Información de la fila
        td_importetotal.text("C$ " + importetotal);
        td_productocantidad.text(cantidadproducto);
        td_button.data("cantidadproducto", cantidadproducto);

        // Actualizar Arreglo
        var index = PurchaseDetail.findIndex(item => item.Product.Id == parseInt($("#txtIdProducto").val()));
        PurchaseDetail[index].Quantity = cantidadproducto;
    }
    $("#txtIdProducto").val("0");
    $("#txtproductocodigo").val("");
    $("#txtproductonombre").val("");
    $("#txtproductodescripcion").val("");
    $("#txtproductostock").val("");
    $("#txtproductoprecio").val("");
    $("#txtproductocantidad").val("0");

    $("#txtproductocodigo").focus();

    calcularPrecios();
})

$('#tbVenta tbody').on('click', 'button[class="btn btn-danger btn-circle btn-sm"]', function () {
    var idproducto = $(this).data("idproducto");
    var cantidadproducto = $(this).data("cantidadproducto");

    controlarStock(idproducto, cantidadproducto);
    PurchaseDetail = PurchaseDetail.filter(Item => Item.Product.Id != idproducto);
    $(this).parents("tr").remove();

    calcularPrecios();
})

$('#tbVenta tbody').on('click', 'button[class="btn btn-primary btn-circle btn-sm mr-1"]', function () {
    var idproducto = $(this).data("idproducto");
    var cantidadproducto = $(this).data("cantidadproducto");

    jQuery.ajax({
        url: '/Product/ReadById',
        type: "POST",
        data: JSON.stringify({ id: idproducto }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            productToChangeQuantity = response.data;
            $("#Quantity").val(cantidadproducto);
            $("#ProductCart").modal('show');
        },
        error: function (error) {
            console.log(error)
        },
        beforeSend: function () {
        },
    });
})

$(function () {
    $("form").submit(function () { return false; });
});

var productToChangeQuantity;

function pressEnter() {
    if (event.key === 'Enter') {
        changeQuantityRow(parseInt($("#Quantity").val()), productToChangeQuantity);
    }
}

function changeQuantityRow(quantity, product) {

    if (quantity <= 0) {
        return;
    }

    var existe_codigo = false;
    var fila;
    $('#tbVenta > tbody  > tr').each(function (index, tr) {

        fila = tr;
        var idproducto = $(fila).find("td.producto").data("idproducto");

        if (idproducto == product.Id) {
            existe_codigo = true;
            return false;
        }
    });

    if (existe_codigo) {
        // Obtener los datos viejos
        var td_button = $(fila).find("td").find("button");
        var td_importetotal = $(fila).find("td.importetotal");
        var td_productocantidad = $(fila).find("td.productocantidad");

        // Calcular los nuevos datos
        var cantidadproducto = quantity;
        var importetotal = product.SalePrice * cantidadproducto;

        var quantityOnStock = td_button.data("cantidadproducto") + product.Stock
        if (quantityOnStock < quantity) {
            console.log("Stock insuficiente.")
            return;
        }

        // Devolver al almacen
        controlarStock(product.Id, td_button.data("cantidadproducto"));

        // Actualizar Información de la fila
        td_importetotal.text("C$ " + importetotal);
        td_productocantidad.text(cantidadproducto);
        td_button.data("cantidadproducto", cantidadproducto);


        // Sacar del almacen
        controlarStock(product.Id, cantidadproducto * -1);

        // Actualizar Arreglo
        var index = PurchaseDetail.findIndex(item => item.Product.Id == product.Id);
        PurchaseDetail[index].Quantity = cantidadproducto;
        $("#ProductCart").modal('hide');
    }
    calcularPrecios();
}

function calcularCambio() {
    var montopago = $("#txtmontopago").val().trim() == "" ? 0 : parseFloat($("#txtmontopago").val().trim());
    var totalcosto = parseFloat($("#txttotal").val().trim());
    var cambio = 0;
    cambio = (montopago <= totalcosto ? totalcosto : montopago) - totalcosto;
    $("#txtcambio").val(cambio.toFixed(2));
}

$('#btnTerminarGuardarVenta').on('click', function () {

    //VALIDACIONES DE CLIENTE
    if ($("#txtclientedocumento").val().trim() == "" || $("#txtclientenombres").val().trim() == "") {
        swal("¡Cuidado!'", "Complete los datos del cliente", "warning");
        return;
    }
    //VALIDACIONES DE PRODUCTOS
    if ($('#tbVenta tbody tr').length == 0) {
        swal("¡Cuidado!", "Debe registrar minimo un producto en la venta", "warning");
        return;
    }

    //VALIDACIONES DE MONTO PAGO
    if ($("#txtmontopago").val().trim() == "") {
        swal("¡Cuidado!", "Ingrese el monto de pago", "warning");
        return;
    }

    if (parseFloat($("#txtmontopago").val().trim()) < parseFloat($("#txttotal").val().trim())) {
        swal("¡Cuidado!", "Monto insuficiente", "warning");
        return;
    }

    calcularCambio();

    var sale = {
        Id: 0,
        Currency: {
            Id: 1
        },
        PaymentType: {
            Id: 1
        },
        Customer: currentSupplier,
        Employee: currentEmployee,
        SaleDetails: PurchaseDetail,
        Payment: parseFloat($("#txtmontopago").val())
    }

    jQuery.ajax({
        url: '/Sale/Create',
        type: "POST",
        data: JSON.stringify({ sale: sale }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {

            $(".card-venta").LoadingOverlay("hide");

            if (response.result) {
                $("#tbVenta tbody").html("");

                var cambio = $("#txtcambio").val();
                var message = "La venta fue realizada con exito.\nEl cambio es: C$ " + cambio;
                successAudio.play();
                swal({
                    title: "Información",
                    text: message,
                    type: "success",
                    confirmButtonClass: "btn-success",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                    function (isConfirm) {
                        if (isConfirm) {
                            var url = "/Sale/Invoce?id=" + response.id;
                            window.open(url);
                        }
                    });
            }
            else {
                console.log(response.message)
                swal("Error", "\n" + response.message, "danger");
            }
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
            $("#txttotal").val("0.00");
            $("#txtmontopago").val("");
            $("#txtcambio").val("0.00");
            PurchaseDetail = [];
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

window.onbeforeunload = function () {
    if ($('#tbVenta tbody tr').length > 0) {

        $('#tbVenta > tbody  > tr').each(function (index, tr) {
            var fila = tr;
            var productocantidad = parseInt($(fila).find("td.productocantidad").text());
            var idproducto = $(fila).find("td.producto").data("idproducto");

            controlarStock(parseInt(idproducto), parseInt(productocantidad));
        });
    }
};

function barcodeScan() {
    if (event.key === 'Enter') {
        const code = $("#barcodeInput").val()

        jQuery.ajax({
            url: '/Product/ReadByCode?code=' + code,
            type: "GET",
            success: function (response) {
                console.log(response.data);
                if (response.data == null) {
                    $("#barcodeInput").val("");
                    swal("¡Cuidado!'", "Codigo de Barra Invalido!", "warning");
                    return;
                }
                const json = response.data;
                $("#barcodeInput").val("");
                $("#txtIdProducto").val(json.Id);
                $("#txtproductocodigo").val(json.Id);
                $("#txtproductonombre").val(json.Name);
                $("#txtproductodescripcion").val(json.StringNetContent);
                $("#txtproductostock").val(json.Stock);
                $("#txtproductoprecio").val(json.SalePrice);
                $("#txtproductocantidad").val("1");
                $('#btnAgregar').click();
                $("#barcodeInput").focus();
            },
            error: function (_) {
                swal("¡Cuidado!'", "Codigo de Barra Invalido!", "warning");
            },
            beforeSend: function () {
            }
        });
    }
}