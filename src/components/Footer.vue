<template>
	<footer :class="{'-translate-y-8': $route.name !== 'Home', 'about-ftr': $route.name === 'About'}" class="bg-white transition-colors dark:bg-dark dark:text-white shadow-2xl w-screen h-8 self-end py-1 flex gap-7 px-7">
		<img :src="`/favicon.svg`" alt="sprinkler logo" :class="{'about-ftr-icon': $route.name === 'About'}" class="-mr-6">
		<h3 class="hidden ft:block">
			{{ $t('footer.created') }}: Peter Bartko
		</h3>
		<h4 class="hidden ft:block">
			{{ $t('footer.bc') }} 2021/2022
		</h4>
		<h3 class="block ft:hidden">
			Peter Bartko
		</h3>
		<h4 class="block ft:hidden">
			2021/2022
		</h4>
	</footer>
</template>

<style>
footer {
  grid-column: 1 / -1;
}

.about-ftr {
  @apply backdrop-blur dark:!bg-[#4c543c29] text-white dark:!text-[#ccc];
  background: #dfff9c29 !important;
}
</style>
