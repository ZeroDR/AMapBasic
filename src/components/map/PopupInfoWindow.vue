<template>
  <MountingPortal mountTo="#popupinfowindow">
    <AmpherInfoWindow></AmpherInfoWindow>
  </MountingPortal>
</template>

<script>
  import AmpherInfoWindow from '@/components/map/AmpherInfoWindow'

  export default {
    name: 'PopupInfoWindow',
    props:['type'],
    components:{
      AmpherInfoWindow
    },
    created() {
    },
    mounted() {
      console.log(this.type);
    }
  }
</script>

<style scoped>

</style>