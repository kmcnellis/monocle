rfkill unblock bluetooth
bluetoothctl
pair FC:58:FA:89:55:4F
connect FC:58:FA:89:55:4F
quit
pactl set-default-sink bluez_sink.FC:58:FA:89:55:4F

