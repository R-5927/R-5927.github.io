window.onload = function () {
    (function () {
        var len = 5 * 5 * 5;
        var oUl = document.getElementById("list").children[0];
        var aLi = oUl.children;
        //创建li
        (function () {
            for (var i = 0; i < len; i++) {
                var oLi = document.createElement("li");

                oLi.index = i;
                oLi.x = i % 5;
                oLi.y = Math.floor(i % 25 / 5);
                oLi.z = Math.floor(i / 25);

                var data = flyData[i] || flyData[0];

                oLi.innerHTML = `
                <b class="liCover"></b>
                <p class="liTitle">${data.type}</p>
                <p class="liAuthor">${data.author}</p>
                <p class="liTime">${data.time}</p>
                `
                var tx = Math.random() * 6000 - 3000,
                    ty = Math.random() * 6000 - 3000,
                    tz = Math.random() * 6000 - 3000;

                oLi.style.transform = `translate3D(${tx}px,${ty}px,${tz}px)`;

                oUl.appendChild(oLi);
            }
            setTimeout(Grid, 20);
        })();

        function Grid() {
            if (Grid.arr) {
                for (var i = 0; i < len; i++) {
                    aLi[i].style.transform = Grid.arr[i];
                }
            } else {
                Grid.arr = []
                var tX = 350,
                    tY = 350,
                    tZ = -800;

                for (var i = 0; i < len; i++) {

                    var _x = (aLi[i].x - 2) * tX,
                        _y = (aLi[i].y - 2) * tY,
                        _z = (aLi[i].z - 2) * tZ;
                    var val = `translate3D(${_x}px,${_y}px,${_z}px)`;
                    aLi[i].style.transform = val;
                    Grid.arr[i] = val;
                }
            }
        };

        (function () {
            var roX = 0,
                roY = 0,
                roZ = -2200;

            document.onmousedown = function (e) {

                var nowX = e.clientX,
                    nowY = e.clientY,
                    lastX = nowX,
                    lastY = nowY,
                    x_ = 0,
                    y_ = 0;


                var ifMove = false,
                    ifTime = new Date();

                if (e.target.nodeName == "B") {
                    var thisli = e.target;
                }
                this.onmousemove = function (e) {
                    ifMove = true;
                    x_ = e.clientX - lastX;
                    y_ = e.clientY - lastY;

                    roY += x_ * 0.15;
                    roX -= y_ * 0.15;

                    oUl.style.transform = `translateZ(${roZ}px) rotateX(${roX}deg) rotateY(${roY}deg)`;

                    lastX = e.clientX;
                    lastY = e.clientY;
                };

                this.onmouseup = function (e) {
                    this.onmousemove = null;

                    if ((ifMove && (e.target === thisli)) || (new Date - ifTime) > 500) {
                        thisli.mark = true;
                    }

                    function m() {
                        x_ *= 0.9;
                        y_ *= 0.9;

                        roY += x_ * 0.15;
                        roX -= y_ * 0.15;

                        oUl.style.transform = `translateZ(${roZ}px) rotateX(${roX}deg) rotateY(${roY}deg)`;

                        if (Math.abs(roY) < 0.1 && Math.abs(roX) < 0.1) return;
                        requestAnimationFrame(m);
                    }
                    requestAnimationFrame(m);
                };
            };

            (function (fn) {
                if (document.onmousewheel === undefined) {
                    document.addEventListener("DOMMouseScroll", function (e) {
                        var d = -e.detail / 3;
                        fn(d);
                    })
                } else {
                    document.addEventListener("mousewheel", function (e) {
                        var d = e.wheelDelta / 120;
                        fn(d);
                    })
                };
            })(function fn(d) {
                roZ += d * 100;
                oUl.style.transform = `translateZ(${roZ}px) rotateX(${roX}deg) rotateY(${roY}deg)`;
            });
        })();

        //弹窗
        (function () {
            var oAlert = document.getElementById("alert"),
                oATitle = oAlert.getElementsByClassName("title")[0].getElementsByTagName("span")[0],
                oAImg = oAlert.getElementsByClassName("img")[0].getElementsByTagName("img")[0],
                oAAuthor = oAlert.getElementsByClassName("author")[0].getElementsByTagName("span")[0],
                oAInfo = oAlert.getElementsByClassName("info")[0].getElementsByTagName("span")[0];

            var oAll = document.getElementById("all"),
                oFrame = document.getElementById("frame"),
                oBack = document.getElementById("back");

            oUl.onclick = function (e) {
                var target = e.target;

                if (target.nodeName === "B") {
                    if (target.mark) {
                        target.mark = false;
                    } else {
                        if (oAlert.style.display == "block") {
                            hide();
                        } else {
                            var index = (target.parentNode.index);
                            var data = flyData[index] || flyData[0];
                            oAlert.index = index;

                            oATitle.innerHTML = `${data.title}`;
                            oAImg.src = `src/${data.src}/index.png`;
                            oAAuthor.innerHTML = `${data.author}`
                            oAInfo.innerHTML = `${data.desc}`
                            show();
                        }
                    }
                }
                e.cancelBubble = true;
            }

            document.onclick = function () {
                hide();
            }

            oAlert.onclick = function () {
                var data = flyData[this.index] || flyData[0]
                oAll.className = "left";
                oFrame.src = `src/${data.src}/index.html`;
            }

            oBack.onclick = function () {
                oAll.className = "";
            };

            function hide() {
                if (oAlert.style.display !== "block" && oAlert.timer) return;
                oAlert.timer = true;

                // oAlert.style.display = 'block';
                // oAlert.style.transform = "rotateY(0deg) scale(1)";
                // oAlert.style.opacity = "1";

                var time = 300,
                    sTime = new Date();

                function m() {
                    var prop = (new Date() - sTime) / 300;
                    if (prop >= 1) {
                        prop = 1
                        oAlert.style.display = 'none';
                        oAlert.timer = false;
                    } else {
                        requestAnimationFrame(m);
                    }
                    oAlert.style.transform = `rotateY(${prop*180}deg) scale(${1-prop})`;
                    oAlert.style.opacity = `${1-prop}`;
                }
                requestAnimationFrame(m);
            };

            function show() {
                if (oAlert.timer) return
                oAlert.timer = true;

                oAlert.style.display = 'block';
                oAlert.style.transform = "rotateY(0deg) scale(2)";
                oAlert.style.opacity = "0";

                var time = 300,
                    sTime = new Date();

                function m() {
                    var prop = (new Date() - sTime) / 300;
                    if (prop >= 1) {
                        prop = 1;
                        oAlert.timer = false;
                    } else {
                        requestAnimationFrame(m);
                    }
                    oAlert.style.transform = `rotateY(0deg) scale(${2-prop})`;
                    oAlert.style.opacity = `${prop}`;
                }
                requestAnimationFrame(m);
            };

        })();

        ! function () {
            var oBtn = document.getElementById("btn").getElementsByTagName("li");
            var arr = [Table, Sphere, Helix, Grid];

            for (var i = 0; i < oBtn.length; i++) {
                oBtn[i].onclick = arr[i];
            };

            function Table() {
                if (Table.arr) {
                    for (var i = 0; i < len; i++) {
                        aLi[i].style.transform = Table.arr[i];
                    }
                } else {
                    Table.arr = [];
                    var n = Math.ceil(len / 18) + 2;
                    var midY = n / 2 - 0.5;
                    var midX = 18 / 2 - 0.5;

                    var disX = 170,
                        disY = 210;

                    var arr = [{
                            x: 0,
                            y: 0
                        },
                        {
                            x: 17,
                            y: 0
                        },
                        {
                            x: 0,
                            y: 1
                        },
                        {
                            x: 1,
                            y: 1
                        },
                        {
                            x: 12,
                            y: 1
                        },
                        {
                            x: 13,
                            y: 1
                        },
                        {
                            x: 14,
                            y: 1
                        },
                        {
                            x: 15,
                            y: 1
                        },
                        {
                            x: 16,
                            y: 1
                        },
                        {
                            x: 17,
                            y: 1
                        },
                        {
                            x: 0,
                            y: 2
                        },
                        {
                            x: 1,
                            y: 2
                        },
                        {
                            x: 12,
                            y: 2
                        },
                        {
                            x: 13,
                            y: 2
                        },
                        {
                            x: 14,
                            y: 2
                        },
                        {
                            x: 15,
                            y: 2
                        },
                        {
                            x: 16,
                            y: 2
                        },
                        {
                            x: 17,
                            y: 2
                        },
                    ];
                    for (var i = 0; i < len; i++) {
                        var x, y;
                        if (i < 18) {
                            x = arr[i].x;
                            y = arr[i].y;
                        } else {
                            x = i % 18;
                            y = Math.floor(i / 18) + 2;
                        }
                        var val = `translate3D(${(x - midX) * disX}px,${(y - midY) * disY}px,0px)`;
                        aLi[i].style.transform = val;
                        Table.arr[i] = val;

                    }
                }
            };

            function Sphere() {
                if (Sphere.arr) {
                    for (var i = 0; i < len; i++) {
                        aLi[i].style.transform = Sphere.arr[i];
                    }
                } else {
                    Sphere.arr = [];
                    var arr = [1, 3, 7, 9, 11, 14, 21, 20, 12, 10, 9, 7, 1],
                        arrLen = arr.length,
                        xDeg = 180 / (arrLen - 1);

                    for (var i = 0; i < len; i++) {
                        var numC = 0;
                        var numG = 0;
                        var arrSum = 0;

                        for (var j = 0; j < arrLen; j++) {
                            arrSum += arr[j];
                            if (arrSum > i) {
                                numC = j;
                                numG = arr[j] - (arrSum - i);
                                break;
                            }
                        }
                        var yDeg = 360 / arr[numC];
                        var val = `rotateY(${(numG+1.3)*yDeg}deg) rotateX(${(90-numC*xDeg)}deg)
                        translateZ(800px)`;
                        aLi[i].style.transform = val;
                        Sphere.arr[i] = val;
                    }
                }
            }

            function Helix() {
                if (Helix.arr) {
                    for (var i = 0; i < len; i++) {
                        aLi[i].style.transform = Helix.arr[i];
                    }
                } else {
                    Helix.arr = [];
                    var h = 4,
                        tY = 7,
                        num = Math.round(len / h),
                        deg = 360 / num,
                        mid = len / 2 - 0.5;

                    for (var i = 0; i < len; i++) {
                        var val = `rotateY(${i*deg}deg) translateY(${tY*(i-mid)}px)
                        translateZ(800px)`;
                        aLi[i].style.transform = val;
                        Helix.arr[i] = val;
                    }
                }
            }

        }()

    })();
}