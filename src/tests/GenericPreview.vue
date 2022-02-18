<template>
  <div class="h-full p-4">
    <div class="space-x-2 p-4">
      <Button2 brand> Brand </Button2>
      <Button2 brand2> Brand2 </Button2>
      <Button2 primary> Primary </Button2>
      <Button2 secondary> Secondary </Button2>
      <Button2> Button </Button2>
      <Button2 primary circle> Rounded </Button2>
      <Button2 disabled> Disabled </Button2>
      <Button2 inactive> Inactive </Button2>
    </div>
    <div class="dark">
      <div class="space-x-2 p-4 dark:bg-black">
        <Button2 brand> Dark brand </Button2>
        <Button2 brand2> Dark brand2 </Button2>
        <Button2 primary> Dark primary </Button2>
        <Button2 secondary> Dark secondary </Button2>
        <Button2> Dark button </Button2>
      </div>
    </div>
    <div class="space-x-2 p-2">
      <Button2 lg primary> Large </Button2>
      <Button2 primary> Normal </Button2>
      <Button2 sm primary> Small </Button2>
      <Button2 lg secondary> Large border </Button2>
      <Button2 secondary> Normal border </Button2>
      <Button2 sm secondary> Small border </Button2>
    </div>
  </div>
</template>
