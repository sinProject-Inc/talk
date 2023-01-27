<script lang="ts">
	import '$lib/app.css'
	import background from '$lib/assets/gradient_geometric_shapes.png'
</script>

<div class="h-screen bg-no-repeat bg-cover" style="background-image: url('{background}')">
	<div class="shadow-in fixed flex min-h-screen w-full flex-col backdrop-blur-md backdrop-filter">
		<slot />
	</div>
</div>
