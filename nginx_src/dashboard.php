<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- Tell the browser to be responsive to screen width -->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <!-- Favicon icon -->
    <link rel="icon" type="image/png" sizes="16x16" href="../assets/images/favicon.png">
    <title>Elite Admin Template - The Ultimate Multipurpose admin template</title>
    <!-- This page CSS -->
    <!-- chartist CSS -->
    <link href="./assets/node_modules/morrisjs/morris.css" rel="stylesheet">
    <!--Toaster Popup message CSS -->
    <link href="./assets/node_modules/toast-master/css/jquery.toast.css" rel="stylesheet">
    <!-- Custom CSS -->
    <link href="dist/css/style.css" rel="stylesheet">
    <link href="dist/css/mystyle.css" rel="stylesheet">
    <!-- Dashboard 1 Page CSS -->
    <link href="dist/css/pages/dashboard1.css" rel="stylesheet">
    <link href="../assets/node_modules/dropzone-master/dist/dropzone.css" rel="stylesheet" type="text/css" />
    <link href="dist/css/pages/progressbar-page.css" rel="stylesheet">
    <link href="dist/css/pages/widget-page.css" rel="stylesheet">

    <link href="./assets/node_modules/chartist-js/dist/chartist.min.css" rel="stylesheet">
    <!-- <link href="./assets/node_modules/chartist-js/dist/chartist-init.css" rel="stylesheet"> -->
    <link href="./assets/node_modules/chartist-plugin-tooltip-master/dist/chartist-plugin-tooltip.css" rel="stylesheet">
    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
    <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
<![endif]-->
</head>

<body class="skin-blue-dark fixed-layout">
    <!-- ============================================================== -->
    <!-- Preloader - style you can find in spinners.css -->
    <!-- ============================================================== -->
    <div class="preloader">
        <div class="loader">
            <div class="loader__figure"></div>
            <p class="loader__label">Openlandscape</p>
        </div>
    </div>
    <!-- ============================================================== -->
    <!-- Main wrapper - style you can find in pages.scss -->
    <!-- ============================================================== -->
    <div id="main-wrapper">

        <!-- ============================================================== -->
        <!-- Topbar header - style you can find in pages.scss -->
        <!-- ============================================================== -->
       <?php 
            include 'dist/php/header.php';
        ?>
        <!-- ============================================================== -->
        <!-- End Topbar header -->
        <!-- ============================================================== -->
        <!-- ============================================================== -->
        <!-- Left Sidebar - style you can find in sidebar.scss  -->
        <!-- ============================================================== -->
        <?php
            include 'dist/php/left-sidebar.php';
        ?>
        <!-- ============================================================== -->
        <!-- End Left Sidebar - style you can find in sidebar.scss  -->
        <!-- ============================================================== -->
        <!-- ============================================================== -->
        <!-- Page wrapper  -->
        <!-- ============================================================== -->
        <div id="page-wrapper" class="page-wrapper">
            <!-- ============================================================== -->
            <!-- Container fluid  -->
            <!-- ============================================================== -->
            <div class="container-fluid">
                <!-- ============================================================== -->
                <!-- Bread crumb and right sidebar toggle -->
                <!-- ============================================================== -->
                <div class="row page-titles">
                    <div class="col-md-5 align-self-center">
                        <h4 class="text-themecolor">Dashboard</h4>
                        
                    </div>
                    <div class="col-md-7 align-self-center text-right">
                        <div class="d-flex justify-content-end align-items-center">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><a href="javascript:void(0)">Home</a></li>
                            <li class="breadcrumb-item active">Dashboard </li>
                        </ol>
                            
                        <button type="button" class="btn btn-success d-none d-lg-block m-l-15" id="btn-download"><i class=" fas fa-save"></i> Download</button>
                         
                        </div>    
                    </div>
                    

                </div>
                <!-- ============================================================== -->
                <!-- End Bread crumb and right sidebar toggle -->
                <!-- ============================================================== -->
                <!-- ============================================================== -->
                <!-- Info box -->
                <!-- ============================================================== -->
                <div id="card-group-gen">
                </div>   
                </div>
               
                <!-- ============================================================== -->
                <!-- End Comment - chats -->
                <!-- ============================================================== -->
                <!-- ============================================================== -->
                <!-- Over Visitor, Our income , slaes different and  sales prediction -->
                <!-- ============================================================== -->
                
                </div>
                <!-- ============================================================== -->
                <!-- End Page Content -->
                <!-- ============================================================== -->
                
                <!-- ============================================================== -->
                <!-- Right sidebar -->
                <!-- ============================================================== -->
               
                <!-- ============================================================== -->
            </div>
            <!-- ============================================================== -->
            <!-- End Container fluid  -->
            <!-- ============================================================== -->
            
        </div>
        <!-- ============================================================== -->
        <!-- End Page wrapper  -->
        <!-- ============================================================== -->
        <!-- ============================================================== -->
        <!-- footer -->
        <!-- ============================================================== -->
       <?php
            include 'dist/php/footer.php';
        ?>
        <!-- ============================================================== -->
        <!-- End footer -->
        <!-- ============================================================== -->
    </div>
    <!-- ============================================================== -->
    <!-- End Wrapper -->
    <!-- ============================================================== -->
    <!-- ============================================================== -->
    <!-- All Jquery -->
    <!-- ============================================================== -->
    <script src="./assets/node_modules/jquery/jquery-3.2.1.min.js"></script>
    <!-- Bootstrap popper Core JavaScript -->
    <script src="./assets/node_modules/popper/popper.min.js"></script>
    <script src="./assets/node_modules/bootstrap/dist/js/bootstrap.min.js"></script>
    <!-- slimscrollbar scrollbar JavaScript -->
    <script src="dist/js/perfect-scrollbar.jquery.min.js"></script>
    <!--Wave Effects -->
    <script src="dist/js/waves.js"></script>
    <!--Menu sidebar -->
    <script src="dist/js/sidebarmenu.js"></script>
    <!--Custom JavaScript -->
    <script src="dist/js/custom.min.js"></script>
    <!-- ============================================================== -->
    <!-- This page plugins -->
    <!-- ============================================================== -->
    <!--morris JavaScript -->
    <script src="./assets/node_modules/raphael/raphael-min.js"></script>
    <script src="./assets/node_modules/morrisjs/morris.min.js"></script>
    <script src="./assets/node_modules/jquery-sparkline/jquery.sparkline.min.js"></script>
   
    <!-- Popup message jquery -->
    <script src="./assets/node_modules/toast-master/js/jquery.toast.js"></script>
    <!-- Chart JS -->
    <script src="dist/js/dashboard1.js"></script>
    <script src="./assets/node_modules/toast-master/js/jquery.toast.js"></script>
    <!-- <script src="../assets/node_modules/dropzone-master/dist/dropzone.js"></script> -->

    <script src="./assets/node_modules/chartist-js/dist/chartist.min.js"></script>
    <script src="./assets/node_modules/chartist-plugin-tooltip-master/dist/chartist-plugin-tooltip.min.js"></script>
    <!-- <script src="./assets/node_modules/chartist-js/dist/chartist-init.js"></script> -->
    <script src="./assets/node_modules/gauge/gauge.min.js"></script>
    <script src="./assets/node_modules/datatables/datatables.js"></script>
    <script src="dist/plugin/dropzone.js"></script>
    <script src="dist/plugin/FileSaver.js"></script>
    <script src="dist/js/pages/widget-data.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/gasparesganga-jquery-loading-overlay@2.1.6/dist/loadingoverlay.min.js"></script>
    <script src="./assets/node_modules/echarts/echarts-all.js"></script>

    <script type="text/javascript">
            var patientInfo = new patientInfo();
            function patientInfo(){
                var self = this;
                var $formLogin = $('form#loginform');
                var params = new window.URLSearchParams(window.location.search);
                this.initial = function(){
                    
                  self.onLoadPage();     
                  $('#btn-download').click(function (e) {
                        self.export() 
                    })
                          
                }
                
            
               
                this.onLoadPage = function(){              
                    // var token = JSON.parse(sessionStorage.getItem('data')).token
                    $.ajax({
                        url: 'http://127.0.0.1/api/vm/find/all',
                        type: 'get',
                        cache: false,
                        // headers:{
                        //     'Authorization':'JWT '+token
                        // },
                        success: function(response){
                            console.log(response);
                            let data = response.DATA

                            data.forEach((element,i) => {
                                let strInfo = ''
                                let namePie = []
                                element.info.forEach(element => {
                                    strInfo+=`<div class="row">
                                                    <h2> ${element.name} : ${element.value}</h2>
                                                </div>`
                                                namePie.push(element.name)
                                });
                                let card = `
                                <div class="card-group">
                                    <div class="card">
                                        <div class="card-body">
                                            <div class="row">
                                                <div class="col-lg-2">
                                                    <div class="card">
                                                        <div class="card-body">
                                                            <div class="row" style="margin-bottom:30px">
                                                                <h3>GROUP ${i+1}</h3>
                                                            </div>
                                                           ${strInfo}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-lg-4">
                                                    <div class="card">
                                                        <div class="card-body">
                                                            <div class="row">
                                                                <div id="pie-chart${i}" style="width:100%; height:300px;"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div class="col-lg-6">
                                                    <div class="card">
                                                        <div class="card-body">

                                                                <table class="table" id="table${i}" style="width:100%; height:300px;">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>No</th>
                                                                            <th>NAMEFILE</th>
                                                                            <th>GROUP PRICE</th>
                                                                            <th>ACTION</th>                                                
                                                                        </tr>
                                                                    </thead>
                                                                </table>
                                                          
                                                        </div>
                                                    </div>
                                                   
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                `
                                $('#card-group-gen').append(card)
                                self.createDataTable(`table${i}`,element.data)

                                self.pieChartGen(`pie-chart${i}`,element.info,namePie)
                                
                                
                            });
                        

                        },
                        error: function(response){
                            Swal.fire(
                                'พบข้อผิดพลาด',
                                'กรุณาตรวจสอบข้อมูลอีกครั้ง',
                                'error'
                                )                             
                            
                        }
                    });
                }
                this.pieChartGen = function(nameDiv,data,namePie){
                    var pieChart = echarts.init(document.getElementById(nameDiv));

                    // specify chart configuration item and data
                    option = {
                    
                        tooltip : {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                            x : 'center',
                            y : 'bottom',
                            data:namePie
                        },
                        toolbox: {
                            show : true,
                            feature : {                           
                                saveAsImage : {show: true}
                            }
                        },
                        color: ["#009efb","#f62d51","#90a4ae", "#dddddd","#ffbc34", "#7460ee", "#2f3d4a", "#55ce63"],
                        calculable : true,
                        series : [
                            
                            {
                                name:'Area mode',
                                type:'pie',
                                radius : [20, 90],
                                center : ['50%', 150],
                                roseType : 'area',
                                x: '50%',               // for funnel
                                max: 40,                // for funnel
                                sort : 'ascending',     // for funnel
                                data:data
                            }                          
                        ]
                    };
                                        
                                        

                    // use configuration item and data specified to show chart
                    pieChart.setOption(option, true), $(function() {
                                function resize() {
                                    setTimeout(function() {
                                        pieChart.resize()
                                    }, 100)
                                }
                                $(window).on("resize", resize), $(".sidebartoggler").on("click", resize)
                            });
                }
                this.export = function() {
                $.LoadingOverlay("show");

                var xhr = new XMLHttpRequest();

                xhr.open('GET', 'http://127.0.0.1/api/vm/download/csv',true);
                // xhr.setRequestHeader("Authorization", 'Bearer '+token);
                xhr.responseType = 'blob';
                setTimeout( xhr.onload = function () {
                    if (this.status === 200) {
                        var filename = "";
                        var disposition = xhr.getResponseHeader('Content-Disposition');
                        if (disposition && disposition.indexOf('attachment') !== -1) {
                            var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                            var matches = filenameRegex.exec(disposition);
                            if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
                        }
                        var type = xhr.getResponseHeader('Content-Type');

                        var blob = typeof File === 'function' ? new File([this.response], filename, { type: type }) : new Blob([this.response], { type: type });
                        if (typeof window.navigator.msSaveBlob !== 'undefined') {
                            // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
                            window.navigator.msSaveBlob(blob, filename);
                        } else {
                            var URL = window.URL || window.webkitURL;
                            var downloadUrl = URL.createObjectURL(blob);
                            if (filename) {
                                // use HTML5 a[download] attribute to specify filename
                                var a = document.createElement("a");
                                // safari doesn't support this yet
                                if (typeof a.download === 'undefined') {
                                    window.location = downloadUrl;
                                } else {
                                    a.href = downloadUrl;
                                    a.download = filename;
                                    document.body.appendChild(a);
                                    a.click();
                                }
                            } else {
                                window.location = downloadUrl;
                            }

                            setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100); // cleanup
                        }
                    }else{
                        global.globalNiftyNoty("ไม่พบข้อมูล",'danger');
                    }
                    $.LoadingOverlay("hide");
                } , 600000);
                xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                xhr.send();
			};

                this.createDataTable = function(nameTable,response){
                    console.log('datatable',nameTable,response);
                    
                    var table = $('table#'+nameTable).DataTable({
                        data: response,
                        destroy: true,
                        rowId: 'ID',
                        bLengthChange : false,
                        bInfo : false,
                        dom:'frtip',
                        "searching": false,
                        "paging": false,
                        "scrollY": "300px",
                        "scrollCollapse": true,
                        // iDisplayLength: 3,
                        responsive: true,
                        columns: [{
                            data: 'ID',
                            className: 'text-left',
                            render: function (data, type, row, meta) {
                            return meta.row + meta.settings._iDisplayStart + 1;
                            }
                        },{
                            data: 'NAMEFILE',
                            className: 'text-left'
                        },{
                            data: 'GROUPPRICE',
                            className: 'text-left'
                        },{
                            data: 'ID',
                            className: 'text-center',
                            width: '15%',
                            render: function(data, type, full, meta) {
                                return data ?'<button type="button" id="btnInfo" class="btn btn-info "><i class="fa fa-fw fa-info" style="color:white"></i>':'';
                            }
                        }],
                      
                        fnDrawCallback: function (oSettings) {
                            $('.btn-info').click(function (e) {
                            var data = table.row( $(this).parents('tr') ).data();
                            // sessionStorage.setItem("HN",data.HN);
                            window.location.href="vminfo.php?id="+data.ID; 
                            })
                        }
                    });
                }
           
            }
            $(document).ready(function () {
                patientInfo.initial();
                
            }); 
            
    </script>
   
</body>

</html>