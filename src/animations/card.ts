import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

const animateCard = trigger('animateCard', [
          state('initial', style({
            position: "initial",
            zIndex: '100'
          })),
          state('expanded', style({
            position: "absolute",
            zIndex: '200',
            maxWidth: '100%'
          })),
          transition('initial => expanded', [
                animate('400ms ease')
          ]),
          transition('expanded => initial', [
                animate('500ms ease')
            ])
        ]);

export default animateCard;