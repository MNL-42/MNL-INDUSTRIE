/* MNL 3D : produits holographiques. THREE r128 doit être chargé avant ce fichier. */
(function(){
if(!window.THREE)return;
var T=THREE,H=Math.PI/2;
var fill=new T.MeshBasicMaterial({color:0x040814,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1});
var lm=new T.LineBasicMaterial({color:0x7fa4ff});
function B(w,h,d){return new T.BoxGeometry(w,h,d)}
function C(r,h,n){return new T.CylinderGeometry(r,r,h,n||20)}
function S(r){return new T.SphereGeometry(r,14,10)}
function O(r,t){return new T.TorusGeometry(r,t,8,28)}
var K={
car:function(E){E(B(4.4,.55,1.9),0,.55,0);E(B(2.1,.55,1.6),-.2,1.1,0);[[-1.4,.9],[1.4,.9],[-1.4,-.9],[1.4,-.9]].forEach(function(p){E(C(.45,.3),p[0],.3,p[1],H,0,0)})},
plane:function(E){E(S(1),0,0,0,0,0,0,[2.2,.6,.9]);E(B(6,.08,.6),0,.4,0);[[-2.4,-1.3],[2.4,-1.3],[-2.4,1.3],[2.4,1.3]].forEach(function(p){E(C(.2,.4,10),p[0],.9,p[1]);E(C(1,.05,24),p[0],1.2,p[1])})},
phone:function(E){E(B(1.3,2.6,.16));E(B(1.1,2.3,.18));E(C(.28,.1),-.3,.9,-.15,H,0,0);E(C(.28,.1),.3,.9,-.15,H,0,0)},
glasses:function(E){E(O(.6,.07),-.8,0,0);E(O(.6,.07),.8,0,0);E(B(.4,.07,.07),0,.2,0);E(B(.07,.07,1.8),-1.4,.1,-.9);E(B(.07,.07,1.8),1.4,.1,-.9)},
earbuds:function(E){E(S(.42),-.9,.6,0);E(S(.42),.9,.6,0);E(C(.1,.9,10),-.9,-.1,.1);E(C(.1,.9,10),.9,-.1,.1);E(B(2.4,.8,1.4),0,-1.1,0)},
robot:function(E){E(S(.5),0,2.1,0);E(B(1.1,1.5,.7),0,.9,0);E(C(.14,1.3,10),-.8,.9,0,0,0,.25);E(C(.14,1.3,10),.8,.9,0,0,0,-.25);E(C(.18,1.5,10),-.3,-.5,0);E(C(.18,1.5,10),.3,-.5,0)},
drone:function(E){E(B(1.1,.4,1.1));[[1,1],[-1,1],[1,-1],[-1,-1]].forEach(function(p){E(B(1.8,.08,.1),p[0]*.9,.05,p[1],0,p[0]*p[1]*.78,0);E(C(.75,.05,24),p[0]*1.6,.25,p[1]*1.6)})},
watch:function(E){E(C(1,.4,32),0,0,0,H,0,0);E(C(.8,.42,32),0,0,0,H,0,0);E(B(.9,1.6,.2),0,1.6,0);E(B(.9,1.6,.2),0,-1.6,0)}
};
function build(kind){
var g=new T.Group();
function E(geo,x,y,z,rx,ry,rz,sc){var o=new T.Group();o.add(new T.Mesh(geo,fill),new T.LineSegments(new T.EdgesGeometry(geo,15),lm));o.position.set(x||0,y||0,z||0);o.rotation.set(rx||0,ry||0,rz||0);if(sc)o.scale.set(sc[0],sc[1],sc[2]);g.add(o)}
(K[kind]||K.car)(E);
var b=new T.Box3().setFromObject(g),z=b.getSize(new T.Vector3()),c=b.getCenter(new T.Vector3());
g.position.set(-c.x,-c.y,-c.z);var w=new T.Group();w.add(g);
var s=4.6/Math.max(z.x,z.y,z.z);w.scale.setScalar(s);w.position.y=-2+z.y*s/2;return w}
function start(el){
var cv=document.createElement("canvas");cv.style.cssText="display:block;width:100%;height:100%;touch-action:pan-y;cursor:grab";el.appendChild(cv);
var r;try{r=new T.WebGLRenderer({canvas:cv,antialias:true,alpha:true})}catch(e){cv.remove();return null}
r.setPixelRatio(Math.min(devicePixelRatio,2));
var sc=new T.Scene(),cam=new T.PerspectiveCamera(40,1,.1,50);cam.position.set(0,1.4,9);cam.lookAt(0,-.2,0);
[[2.9,.04],[2,.02]].forEach(function(a){var m=new T.Mesh(new T.RingGeometry(a[0],a[0]+a[1],64),new T.MeshBasicMaterial({color:0x2f6bff,side:2}));m.rotation.x=-H;m.position.y=-2.02;sc.add(m)});
var m=build(el.dataset.mnl3d);sc.add(m);
var ry=.6,drag=0,lx=0,id,calm=matchMedia("(prefers-reduced-motion:reduce)").matches;
function size(){var w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;r.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()}
addEventListener("resize",size);size();
cv.addEventListener("pointerdown",function(e){drag=1;lx=e.clientX;cv.setPointerCapture(e.pointerId)});
cv.addEventListener("pointermove",function(e){if(drag){ry+=(e.clientX-lx)*.01;lx=e.clientX}});
cv.addEventListener("pointerup",function(){drag=0});cv.addEventListener("pointercancel",function(){drag=0});
(function loop(){id=requestAnimationFrame(loop);if(!drag&&!calm)ry+=.006;m.rotation.y=ry;r.render(sc,cam)})();
return function(){cancelAnimationFrame(id);removeEventListener("resize",size);r.dispose();r.forceContextLoss();cv.remove()}}
function mount(el){var stop=null;if(!("IntersectionObserver"in window)){stop=start(el);return}new IntersectionObserver(function(e){if(e[0].isIntersecting&&!stop)stop=start(el);else if(!e[0].isIntersecting&&stop){stop();stop=null}}).observe(el)}
window.MNL3D={mount:mount};
document.querySelectorAll("[data-mnl3d]").forEach(mount);
})();