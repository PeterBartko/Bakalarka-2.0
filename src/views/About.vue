<template>
	<div class="transition-colors">
		<div class="fixed -z-10 w-screen h-screen bg-no-repeat bg-right bg-cover bg-fixed bg">
			<div class="absolute inset-0 -z-5 bg-cover dark:bg-black/50 overflow-hidden" />
		</div>
		<div class="pl-5 mb:pl-8 xl:pl-11 w-full xl:w-1/2 h-[calc(100vh-50px)] pt-11 md:pt-24 xl:pt-40 text-left font-bold text-white dark:text-[#ccc]">
			<h2 class="text-[10vw] md:text-[6vw] xl:text-[5vw]">
				Sprinkler
			</h2>
			<h3 class="text-[8vw] md:text-[5vw] xl:text-[4vw]">
				{{ $t('about.hero1') }} <br> {{ $t('about.hero2') }}
			</h3>
			<router-link to="/register" class="xl:text-[3vw] md:text-[5vw] mb:text-[4vw] text-[6vw] underline font-medium mt-20 text-white decoration-main hover:decoration-main_h hover:text-gray-200">
				{{ $t('about.createAccount') }}
			</router-link>
		</div>
	</div>
</template>

<style scoped>
.bg {
  background-image: url('@/assets/images/bg.jpg');
}
</style>
