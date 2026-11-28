// Follow the handoff once, when the service example comes into view.
const serviceExample = document.querySelector('.sample');
if (serviceExample && 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      serviceExample.classList.add('in-view');
      observer.disconnect();
    }
  }, { threshold: 0.35 });
  observer.observe(serviceExample);
}
