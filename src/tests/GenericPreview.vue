<script setup lang="ts">
  import IconSpeakerphone from '~icons/heroicons-solid/speakerphone'
</script>

<template>
  <div class="h-full p-4">
    <div class="space-y-2 p-2">
      <Button2 secondary full> Full </Button2>
      <Button2
        secondary
        full
        :leftSvg="IconSpeakerphone"
        :rightSvg="IconSpeakerphone"
      >
        Full 2
      </Button2>
      <Button2 secondary full center> Full center </Button2>
      <Button2 secondary full center :leftSvg="IconSpeakerphone">
        Full center 2
      </Button2>
      <Button2
        secondary
        full
        center
        :leftSvg="IconSpeakerphone"
        :rightSvg="IconSpeakerphone"
      >
        Full center 3
      </Button2>
    </div>
    <div class="space-x-2 p-2">
      <Button2 brand> Brand </Button2>
      <Button2 brand2> Brand2 </Button2>
      <Button2 primary> Primary </Button2>
      <Button2 secondary> Secondary </Button2>
      <Button2> Button </Button2>
      <Button2 primary roundedFull> Rounded full </Button2>
      <Button2 disabled> Disabled </Button2>
      <Button2 inactive> Inactive </Button2>
    </div>
    <div class="dark space-x-2 bg-black p-2">
      <Button2 brand> Dark brand </Button2>
      <Button2 brand2> Dark brand2 </Button2>
      <Button2 primary> Dark primary </Button2>
      <Button2 secondary> Dark secondary </Button2>
      <Button2> Dark button </Button2>
    </div>
    <div class="space-x-2 p-2">
      <Button2 lg primary> Large </Button2>
      <Button2 primary> Normal </Button2>
      <Button2 sm primary> Small </Button2>
      <Button2 lg secondary> Large border </Button2>
      <Button2 secondary> Normal border </Button2>
      <Button2 sm secondary> Small border </Button2>
    </div>
    <div class="space-x-2 p-2">
      <Button2 lg primary :leftSvg="IconSpeakerphone"> Large </Button2>
      <Button2 primary :leftSvg="IconSpeakerphone"> Normal </Button2>
      <Button2 sm primary :leftSvg="IconSpeakerphone"> Small </Button2>
      <Button2 lg secondary :leftSvg="IconSpeakerphone"> Large border </Button2>
      <Button2 secondary :leftSvg="IconSpeakerphone"> Normal border </Button2>
      <Button2 sm secondary :leftSvg="IconSpeakerphone"> Small border </Button2>
    </div>
    <div class="space-x-2 p-2">
      <Button2 brand :leftSvg="IconSpeakerphone"> Brand </Button2>
      <Button2 brand2 :leftSvg="IconSpeakerphone"> Brand2 </Button2>
      <Button2 primary :leftSvg="IconSpeakerphone"> Primary </Button2>
      <Button2 secondary :leftSvg="IconSpeakerphone"> Secondary </Button2>
      <Button2 :leftSvg="IconSpeakerphone"> Button </Button2>
      <Button2 :leftSvg="IconSpeakerphone" disabled> Button </Button2>
    </div>
    <div class="dark space-x-2 bg-black p-2">
      <Button2 brand :leftSvg="IconSpeakerphone"> Brand </Button2>
      <Button2 brand2 :leftSvg="IconSpeakerphone"> Brand2 </Button2>
      <Button2 primary :leftSvg="IconSpeakerphone"> Primary </Button2>
      <Button2 secondary :leftSvg="IconSpeakerphone"> Secondary </Button2>
      <Button2 :leftSvg="IconSpeakerphone"> Button </Button2>
      <Button2 :leftSvg="IconSpeakerphone" disabled> Button </Button2>
    </div>
  </div>
</template>
