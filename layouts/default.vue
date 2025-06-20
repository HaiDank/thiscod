<script>
</script>

<template>
	<section class="w-screen h-screen flex flex-col relative">
		<header>
			<SignedOut>
				<SignInButton />
			</SignedOut>
			<SignedIn>
				<UserButton />
			</SignedIn>
			<ModeToggle />
		</header>

		<div class="w-full h-full flex">
			<slot />
		</div>
	</section>
</template>
