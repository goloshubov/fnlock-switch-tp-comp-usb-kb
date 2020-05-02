# tp-comp-keyboard-fnlk-switch
Gnome Shell Extension - FnLk switch for Lenovo ThinkPad Compact (USB) Keyboard 

Why. There is an issue with Lenovo ThinkPad Compact Keyboard - FnLk doesn't work by pressing Fn+Esc in Linux. Manual toggling by writing 1|0 into `/sys/bus/hid/devices/*17EF\:604*/fn_loc` is possible though, thanks to: https://github.com/lentinj/tp-compact-keyboard.

Fn is unlocked\
![screenshot00](https://github.com/goloshubov/tp-comp-keyboard-fnlk-switch/blob/master/about/screenshots/ss00.png)

Fn is locked (FnLk)\
![screenshot01](https://github.com/goloshubov/tp-comp-keyboard-fnlk-switch/blob/master/about/screenshots/ss01.png)

Notice that (Gnome) user should have write access to `/sys/bus/hid/devices/*17EF\:604*/fn_loc`
