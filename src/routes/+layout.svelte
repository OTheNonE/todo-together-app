<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { getUser } from '$lib/rpc/user/index.remote';
	
	let { children } = $props();
	const user = $derived(getUser());
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div>
	<svelte:boundary>
		{@const user = await getUser()}

		{#if user}
			<div>
				<p> Hello {user.name} </p>
				<a href="logout"> Logout </a>
			</div>
		{:else}
			<div>
				<p> You are not logged in. </p>
				<a href="/login/google"> Login </a>
			</div>
		{/if}

		{#snippet pending()}
			<p> ...loading... </p>
		{/snippet}

	</svelte:boundary>
</div>

{@render children?.()}

<div class="dock dock-sm">
	<a href="/">
		Home
	</a>
	<a href="/list">
		List
	</a>
	<a href="/settings">
		User
	</a>
</div>