/**
 * Awaits ms milliseconds
 * 
 * @param {Number} ms 
 * @returns 
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function setCookie(cname, cvalue, exdays) {
    let expires="";

    if(exdays){
        const d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        expires = ";expires="+ d.toUTCString();
    }

    document.cookie = cname + "=" + cvalue + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

/**
 * Animates an element with a writing effect
 * 
 * @param {HTMLElement} element 
 * @param {Number} delay milliseconds to wait between one character and the other (default: 1000)
 * @param {Number} cont continue displaying the cursor (_) animation for the given amount of repetitions
 * @param {String} cursor string to display as cursor (default: "_")
 *
 */
async function writeanimation(element, config={cont: 0, delay: 1000, cursor:"_", makeVisible:false, cursor_flashing:true, __default:true}, then) {
    //Default configs
    const cont=config.cont??0;
    const delay=config.delay??1000;
    const cursor=config.cursor??"_";
    const makeVisible=config.makeVisible??false;
    let cursor_flashing=config.cursor_flashing??true;
    if(delay<500 && (config.__default || !config.cursor_flashing))
        cursor_flashing=false;

    //Initialize animation
    if(makeVisible)
        element.style.visibility="visible";

    const text=element.innerText;
    element.innerHTML = "";

    //Start animation
    await sleep(delay);
    for (var c = 0; c < (text.length+cont); c++) {
        element.innerHTML = text.slice(0, c + 1) + cursor;
        await sleep(delay);
        if(cursor && cursor_flashing && c+1!=text.length+cont){
            element.innerHTML = text.slice(0, c + 1) + '<span style="visibility:hidden">'+cursor+'</span>';
            await sleep(delay);
        }
        if(cursor && c+1==text.length+cont){
            element.innerHTML = text;
            await sleep(delay);
        }
    }
    
    //Execute new function
    if(typeof then == 'function')
        then();
}

/**
 * Initialize the accordions
 * 
 * @param {HTMLElement[]} elements 
 */
function initAccordion(elements){
    var acc = (elements||document.getElementsByClassName("accordion"));
    var i;

    for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        /* Toggle between adding and removing the "active" class,
        to highlight the button that controls the panel */
        this.classList.toggle("active");

        /* Toggle between hiding and showing the active panel */
        var panel = this.nextElementSibling;
        if (panel.style.display === "block") {
        panel.style.display = "none";
        } else {
        panel.style.display = "block";
        }
    });
    }
}

// Init var
let slideIndex=null;
let __slides=null;

// Next/previous controls
function plusSlides(n) {
  showSlides(__slides, slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(__slides, slideIndex = n);
}

function showSlides(slides, n, automatic) {
    if(!automatic){
        let i;
        let dots = document.getElementsByClassName("dot");
        if (n > slides.length) {slideIndex = 1}
        if (n < 1) {slideIndex = slides.length}
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }
        slides[slideIndex-1].style.display = "block";
        dots[slideIndex-1].className += " active";
    } else {
        let i;
        for (i = 0; i < slides.length; i++) {
          slides[i].style.display = "none";
        }
        slideIndex++;
        if (slideIndex > slides.length) {slideIndex = 1}
        slides[slideIndex-1].style.display = "block";
        setTimeout(showSlides, 2000); // Change image every 2 seconds      
    }
}

/**
 * Initialize slideshows
 * 
 * @param {HTMLElement[]} slides
 * @param {Bool} automatic 
 */
function initSlideshow(slides, automatic){
    __slides=slides;

    if(!automatic){
        slideIndex = 1;
        showSlides(slides, slideIndex);
    } else {
        slideIndex = 0;
        showSlides(slides, slideIndex, true);
    }
}

function dropdown(element) {
    element.classList.toggle("show");
}
  
function initDropdown(button, container){
    button.addEventListener("click", function(){dropdown(container); button.classList.toggle('open');});
    // Close the dropdown menu if the user clicks outside of it
    window.onclick = function(event) {
        if (!event.target.matches('.dropbtn') && !event.target.matches('.dropbtn-child')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
            }
            if(button.classList.contains('open')){
                button.classList.remove('open');
            }
        }
        }
    }
}

function initDrag(elmnt) {
  var pos1= 0, pos2 =  0, pos3=0, pos4=0;
  
  //Set initial position
  if(getCookie(elmnt.getAttribute("name")+"-drag-top") && getCookie(elmnt.getAttribute("name")+"-drag-left")){
    elmnt.style.top = getCookie(elmnt.getAttribute("name")+"-drag-top");
    elmnt.style.left = getCookie(elmnt.getAttribute("name")+"-drag-left");
  }

  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    document.getElementById(elmnt.id + "header").addEventListener('touchstart', dragMouseDown);
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
    elmnt.addEventListener('touchstart', dragMouseDown);
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX ?? e.targetTouches[0].pageX;
    pos4 = e.clientY ?? e.targetTouches[0].pageY;
    document.onmouseup = closeDragElement;
    elmnt.addEventListener('touchend', closeDragElement);
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
    elmnt.addEventListener('touchmove', elementDrag);
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - (e.clientX ?? e.targetTouches[0].pageX);
    pos2 = pos4 - (e.clientY ?? e.targetTouches[0].pageY);
    pos3 = e.clientX ?? e.targetTouches[0].pageX;
    pos4 = e.clientY ?? e.targetTouches[0].pageY;
    // set the element's new position:
    if(!(elmnt.offsetTop - pos2>=(document.documentElement.scrollHeight??window.innerHeight)-elmnt.offsetHeight || elmnt.offsetTop - pos2<=0 || elmnt.offsetLeft - pos1>=document.documentElement.offsetWidth-elmnt.offsetWidth || elmnt.offsetLeft - pos1<=0)){
        elmnt.style.top = ((elmnt.offsetTop - pos2)*100)/window.innerHeight + "%";
        elmnt.style.left = ((elmnt.offsetLeft - pos1)*100)/document.documentElement.offsetWidth + "%";
    }
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;

    //save
    setCookie(elmnt.getAttribute("name")+"-drag-top", elmnt.style.top.replace("%", "%25"), 1000); setCookie(elmnt.getAttribute("name")+"-drag-left", elmnt.style.left.replace("%", "%25"), 1000)
  }
}

function scrollFunction(btn) {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        btn.style.display = "block";
    } else {
        btn.style.display = "none";
    }
}

function initToTop(btn){
    // When the user scrolls down 20px from the top of the document, show the button
    window.onscroll = function() {scrollFunction(btn)};

    $(btn).on("click", function(event){
        // Prevent default anchor click behavior
        event.preventDefault();

        // Using jQuery's animate() method to add smooth page scroll
        // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
        $('html, body').animate({
        scrollTop: $("#top").offset().top
        }, 800, function(){

        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = "#top"
        });
    });
}


function filterSelection(c) {
  var x, i;
  x = document.getElementsByClassName("column");
  if (c == "all") c = "";
  // Add the "show" class (display:block) to the filtered elements, and remove the "show" class from the elements that are not selected
  for (i = 0; i < x.length; i++) {
    x[i].classList.remove("show");
    if (x[i].className.indexOf(c) > -1) x[i].classList.add("show");
  }
}

function initFilter(btnContainer=document.getElementById("myBtnContainer")){
    filterSelection("all") // Execute the function and show all columns
    // Add active class to the current button (highlight it)
    var btns = btnContainer.getElementsByClassName("btn");
    for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function(){
        var current = this.parentElement.querySelectorAll(".btn.active");
        for(i=0; i<current.length; i++)
            current[i].classList.remove("active");
        this.classList.add("active");
    });
    }
}

function openTab(name, elmnt, color) {
    // Hide all elements with class="tabcontent" by default */
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Remove the background color of all tablinks/buttons
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "white";
        tablinks[i].style.color = "black"; 
    }

    // Show the specific tab content
    document.getElementById(name).style.display = "block";
    document.getElementById(name+"-header").style.display = "block";

    // Add the specific color to the button used to open the tab content
    elmnt.style.backgroundColor = color;
    elmnt.style.color = "transparent";
    if(elmnt.id!="defaultOpen")
        window.location.href="#top";
    else
        elmnt.id="";
}

function scrollToTop(offset, thnex, rep){
    if(!rep){
        window.scrollTo(0, offset);
    }

    var scrolltop_r = document.documentElement.scrollTop || document.body.scrollTop;
    if(scrolltop_r.toString().replace(/[?<=\.](.*)/g, "").replace(/.$/,"0") != offset.toString().replace(/[?<=\.](.*)/g, "").replace(/.$/,"0")){
        window.setTimeout(()=>{scrollToTop(offset, thnex, true)}, 100);
    } else {
        thnex();
    }
}