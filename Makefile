all: zip shexli

zip:
	cd fnlock-switch-tp-comp-usb-kb@goloshubov.github.io &&\
    zip -r -FS ../../fnlock-switch-tp-comp-usb-kb.zip *

shexli:
	source ~/python-venv/py/bin/activate &&\
    shexli ../fnlock-switch-tp-comp-usb-kb.zip
