### Background

It has been shown that the LLM generated text can hold orthogonal information to the content of the text, if read by the same architecture LLM [1]. In addition example show that LLM can recognise their own text easily [2].


### Status

A simple watermarking system can be implemented by steering the model on a random direction. This is a promising approach as it does not require any modification of the training procedure, and can be applied to any model with a steerable latent space. However, it is still unclear how robust this method is against adversarial attacks, and how it can be used in practice.

![steering-sheme](assets/projects/watermarking.png)


### References

[1] Alex Cloud, et. al (2025). *Subliminal Learning: Language models transmit behavioral traits via hidden signals in data*. Preprint: https://doi.org/10.48550/arXiv.2507.14805

[2] Arjun Panickssery et. al (2024) *Llm evaluators recognize and favor their own generations* ICML'24 https://doi.org/10.52202/079017-2197