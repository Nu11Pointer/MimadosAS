// Variables Globales
var rowSelected;
var purchaseTable;
var purchaseObj;
var startDay;
var endDay;

// Evento Document Loaded
document.addEventListener('DOMContentLoaded', function () {
    SetUp();
});

// Función Principal
function SetUp() {
    // Pintar Menu Collapse
    $('#CollapseMenuSupplier').addClass('active');
    $('#collapseSix').addClass('show');
    $('#CollapseMenuItemHistoryPurchase').addClass('active');

    // Show DataTable
    Fetch(moment().startOf('day').format('DD/MM/YYYY HH:mm:ss a'), moment().endOf('day').format('DD/MM/YYYY HH:mm:ss a'))

    // $("#txtfechainicio").datepicker({ dateFormat: 'dd/mm/yy' }).datepicker('setDate', new Date())
    $("#txtfechainicio").daterangepicker({
        timePicker: true,
        ranges: {
            'Hoy': [moment(), moment()],
            'Ayer': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Últimos 7 Dias': [moment().subtract(6, 'days'), moment()],
            'Últimos 30 Dias': [moment().subtract(29, 'days'), moment()],
            'Este Mes': [moment().startOf('month'), moment().endOf('month')],
            'Mes Pasado': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'Este Año': [moment().startOf('year'), moment().endOf('year')],
            'Año Pasado': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')],
        },
        locale: {
            format: 'DD/MM/YYYY HH:mm:ss a'
        }
    }, function (start, end) {
        startDay = start;
        endDay = end;
        $('#dataTable').DataTable().destroy();
        Fetch(start.format('DD/MM/YYYY HH:mm:ss a'), end.format('DD/MM/YYYY HH:mm:ss a'));
    });

    startDay = new moment();
    endDay = new moment();
}

function Read() {

    $.fn.dataTable.moment('DD/MM/YYYY HH:mm:ss a');

    purchaseTable = $('#dataTable').DataTable({
        responsive: true,
        ordering: true,
        "ajax": {
            url: '/Purchase/Read',
            type: "GET",
            dataType: "json"
        },
        columnDefs: [{
            target: 1,
            type: 'datetime-moment'
        }],
        "columns": [
            { "data": "Id" },
            { "data": "StringTimeStamp", "render": s => s.substring(0, 20) + (s.substring(20) == 'a. m.' ? 'am' : 'pm') },
            { "data": "Supplier.Name" },
            { "data": "Total" },
            {
                "data": "Id", render: function (data, type, row, meta) {
                    var json = JSON.stringify(row);
                    return "<button class='btn btn-info btn-circle btn-sm mr-1 mb-1' type='button' onclick='invoice(" + json + ")'><i class='fas fa-file-invoice'></i></button>"
                },
                "orderable": false,
                "searchable": false
            }
        ],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.4/i18n/es_es.json"
        },
        "order": [[1, "desc"]]
    });
}

function Fetch(start, end) {

    $.fn.dataTable.moment('DD/MM/YYYY HH:mm:ss a');

    console.log(start, end);
    purchaseTable = $('#dataTable').DataTable({
        buttons: true,
        responsive: true,
        ordering: true,
        "ajax": {
            url: '/Purchase/Fetch',
            type: "POST",
            data: { start: start, end: end }
        },
        columnDefs: [{
            target: 1,
            type: 'datetime-moment'
        }],
        "columns": [
            { "data": "Id" },
            { "data": "StringTimeStamp", "render": s => s.substring(0, 20) + (s.substring(20) == 'a. m.' ? 'am' : 'pm') },
            { "data": "Supplier.Name" },
            { "data": "Total" },
            {
                "data": "Id", render: function (data, type, row, meta) {
                    var json = JSON.stringify(row);
                    return "<button class='btn btn-info btn-circle btn-sm mr-1 mb-1' type='button' onclick='invoice(" + json + ")'><i class='fas fa-file-invoice'></i></button>"
                },
                "orderable": false,
                "searchable": false
            }
        ],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.4/i18n/es_es.json"
        },
        "order": [[1, "desc"]]
    });
}

function Excel() {

    var start = startDay.format('DD/MM/YYYY HH:mm:ss a');
    var end = endDay.format('DD/MM/YYYY HH:mm:ss a');

    var url = '/Purchase/Excel?start=' + start + '&end=' + end;
    window.open(url);
}

function PDF() {

    var start = startDay.format('DD/MM/YYYY HH:mm:ss a');
    var end = endDay.format('DD/MM/YYYY HH:mm:ss a');

    var url = '/Purchase/Report?start=' + start + '&end=' + end;
    window.open(url);
}

function invoice(json) {
    var url = "/Purchase/Invoce?id=" + json.Id;
    window.open(url);
}
