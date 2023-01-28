<script lang="ts">
	import '$lib/app.css'
	import background from '$lib/assets/gradient_geometric_shapes.png'
</script>

<div class="bg-fixed min-h-screen bg-no-repeat bg-cover" style="background-image: linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url('{background}')">
	<div class="shadow-in flex fixed min-h-screen w-full flex-col backdrop-blur-md backdrop-filter">
	</div>
	<slot />
</div>
