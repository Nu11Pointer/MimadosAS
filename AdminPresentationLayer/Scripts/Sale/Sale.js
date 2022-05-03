var tablaproducto;
var tablacliente;
var currentClient;
var productList = []

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
        data: JSON.stringify({ id: 1 }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {

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
        }
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
        }
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
    productList.push(json)
    $("#txtIdProducto").val(json.Id);
    $("#txtproductocodigo").val(json.Id);
    $("#txtproductonombre").val(json.Name);
    //$("#txtproductodescripcion").val(json.Name);
    $("#txtproductostock").val(json.Stock);
    $("#txtproductoprecio").val(json.SalePrice);
    $("#txtproductocantidad").val("0");
    $('#modalProducto').modal('hide');
}